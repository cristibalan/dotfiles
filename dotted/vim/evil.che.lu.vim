""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""
"""""""""" tabs and spaces
""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""
function! CHELU_indenting()
  set autoindent nocindent nosmartindent
  set indentexpr=
endfunction
function! CHELU_tabsize(size)
  let &tabstop     = a:size
  let &shiftwidth  = a:size
  let &softtabstop = a:size
endfunction

function! CHELU_spaces()
  set expandtab
  call CHELU_indenting()
  call CHELU_tabsize(2)
endfunction

function! CHELU_tabs()
  set noexpandtab
  call CHELU_indenting()
  call CHELU_tabsize(4)
endfunction

""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""
"""""""""" event handlers
""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""
let g:CURRENTSIZE = 1
let g:SIZES = []
call add(g:SIZES, { "columns": 179, "columnsfs": 180, "lines":47, "linesfs": 50, "guifont":"Monaco:h11" })
call add(g:SIZES, { "columns": 156, "columnsfs": 158, "lines":41, "linesfs": 44, "guifont":"Monaco:h13" })
call add(g:SIZES, { "columns": 114, "columnsfs": 115, "lines":28, "linesfs": 30, "guifont":"Monaco:h18" })

function! GuiSizeSet(size)
  if eval(&fullscreen)
    exec "set columns=" . g:SIZES[a:size].columnsfs . " lines=" . g:SIZES[a:size].linesfs
  else
    exec "set columns=" . g:SIZES[a:size].columns . " lines=" . g:SIZES[a:size].lines
  end
  exec "set guifont=" . g:SIZES[a:size].guifont
  let g:CURRENTSIZE = a:size
endfunction
function! GuiSizePrev()
  let maxsize = len(g:SIZES)
  let prevsize = g:CURRENTSIZE - 1
  if prevsize == -1
    let nextsize = maxsize - 1
  end
  call GuiSizeSet(prevsize)
endfunction
function! GuiSizeNext()
  let maxsize = len(g:SIZES)
  let nextsize = g:CURRENTSIZE + 1
  if nextsize == maxsize
    let nextsize = 0
  end
  call GuiSizeSet(nextsize)
endfunction
function! ToggleFullSCreen()
  exec "set fullscreen!"
  call GuiSizeSet(g:CURRENTSIZE)
endfunction

let g:INLINEARROWS = 0
function! ToggleInlineArrows()
  if g:INLINEARROWS == 0
    imap i <UP>
    imap j <LEFT>
    imap k <DOWN>
    imap l <RIGHT>
    let g:INLINEARROWS = 1
  else
    iunmap i
    iunmap j
    iunmap k
    iunmap l
    let g:INLINEARROWS = 0
  end
endfunction

function! GuiEnter()
  set linespace=0
  if has("macunix")
    call GuiSizeSet(g:CURRENTSIZE)
  endif

  if has("winaltkeys")
    simalt ~x
  endif
endfunction

function! BufEnter()
  call CdReset()
endfunction

function! TabLeave()
  if ((getbufvar("%", "&mod") == 0) && (bufname("%") == '' || bufname("%") == '[No Name]' || bufname("%") == '[No File]'))
    :bwipeout
  endif
endfunction

function! VimLeave()
  :1,255bwipeout
endfunction

""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""
"""""""""" misc
""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""
function! CreateNewFile(newfile)
  "call inputsave()
  "let newfilename= input("Please give file name: ")
  "call inputrestore()
  let crtbufdir = expand("%:p:h")
  if a:newfile == ""
   return
  endif
  exec "e " . crtbufdir . "/" . a:newfile
endfunction

function! FuzzyReIndexCwd()
  call FuzzyReIndex(getcwd())
endfunction
function! FuzzyReIndex(dir)
  " dir is not:
  "   work/archive
  " and dir is:
  "   work/*/*
  "   src/*
  if ((a:dir !~ 'work\/(archive)') && (a:dir =~ 'work\/\w\w*\/\w\w*' || a:dir =~ 'work\/\w\w*'))
    echo "reindexing " . a:dir
    FuzzyFinderTextMateRefreshFiles
  endif
endfunction
let g:CWD = ""
function! Cd(cd)
  exec "cd " . a:cd
  let g:CWD = getcwd()
  return getcwd()
endfunction
function! CdReset()
  if g:CWD == ""
    let g:CWD = getcwd()
  else
    call Cd(g:CWD)
  end
endfunction

function! GetRoot(path)
  let oldcwd = getcwd()
  call Cd(a:path)
  let root = Slashify(Cd("/"))
  call Cd(oldcwd)
  return root
endfunction

function! Slashify(str)
  return substitute(a:str, "\\", "/", "g")
endfunction

function! GetCwdCurrent()
  return expand("%:p:h")
endfunction

function! CwdCurrent()
  call Cd(GetCwdCurrent())
  call FuzzyReIndexCwd()
endfunction

function! CwdUp()
  let dirname = Slashify(expand('%:p:h'))
  let cwd     = Slashify(getcwd())
  let root    = GetRoot(cwd)
  if (stridx(dirname, cwd) == -1 || cwd == GetRoot(cwd))
    call Cd(dirname)
  else
    call Cd(substitute(cwd, "[^/]*$", "", ""))
  end
endfunction

function! CwdDown()
  let dirname = Slashify(expand('%:p:h'))
  let cwd     = Slashify(getcwd())

  if cwd == GetRoot(cwd)
    let cwd = substitute(cwd, "/$", "", "")
  end
  if stridx(dirname, cwd) == -1
    call Cd(dirname)
  else
    if (dirname == cwd)
      call Cd("/")
    else
      let dirname = substitute(dirname, cwd . "/", "", "")
      call Cd(cwd . "/" . substitute(dirname, "/.*", "", ""))
    end
  end
endfunction

" Explore deletes the quote register. Need to revive the mofo!
function! BrowserFromCurrentDir()
  let g:OLDQUOTEREGISTER = @"
  let dirname = Slashify(expand('%:p:h'))
  tabnew
  tabmove
  exec "Explore"
  let @" = g:OLDQUOTEREGISTER
endfunction

function! BrowserFromCurrentFilePath()
  let g:OLDQUOTEREGISTER = @"
  let dirname = Slashify(expand('%:p:h'))
  tabnew
  tabmove
  exec "Explore " . dirname
  let @" = g:OLDQUOTEREGISTER
endfunction

function! MoveCursor(move, mode)
  if (a:move == 'h')
    if (a:mode == '0')
      normal 0
    elseif (a:mode =~ '^\^')
      if (a:mode == '^g')
        normal g^
      elseif (a:mode == '^n')
        normal ^
      endif
    endif
  elseif (a:move == 'e')
    if (a:mode =~ '^\$')
      if (a:mode == '$g')
        normal g$
      elseif (a:mode == '$n')
        normal $
      endif
    endif
  endif
endfunction

function! MoveTabLeft()
  let newtabnr = tabpagenr() - 2
  if newtabnr == -1
    let newtabnr = v:lnum
  end
  exec ":tabmove " . newtabnr
endfunction
function! MoveTabRight()
  let newtabnr = tabpagenr()
  if newtabnr == v:lnum
    let newtabnr = 0
  end
  exec ":tabmove " . newtabnr
endfunction

"""""""""" home key moves between 0 and ^
function! HomeKey()
  let oldmode = mode()
  let oldcol = col('.')
  call MoveCursor('h', '^n')
  let newcol = col('.')
  if (oldcol == newcol)
    if (&wrap != 1) || (newcol <= winwidth(0) - 20)
      call MoveCursor('h', '0')
      let lastcol = col('.')
      if (newcol == lastcol)
        if (newcol == oldcol)
          normal i
        else
          call MoveCursor('h', '^n')
        endif
      else
        call MoveCursor('h', '0')
      endif
    endif
  endif
endfunction

""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""
"""""""""" editing helpers
""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""
"""""""""" line swapping
function! SwapUp()
  if ( line( '.' ) > 1 )
    let cur_col = virtcol(".")
    if ( line( '.' ) == line( '$' ) )
      normal ddP
    else
      normal ddkP
    endif
    execute "normal " . cur_col . "|"
  endif
endfunction

function! SwapDown()
  if ( line( '.' ) < line( '$' ) )
    let cur_col = virtcol(".")
    normal ddp
    execute "normal " . cur_col . "|"
  endif
endfunction

""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""
"""""""""" status line, tabline, tablabel, guitablabel and other funky stuff
""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""
"""""""""" statusline
function! PathToShortHome(path)
  return substitute(a:path, $HOME, "~", "")
endfunction

function! CwdShort()
  return substitute(PathToShortHome(getcwd()), "\\", "/", "g")
endfunction

function! ShowFileFormatFlag(var) 
  if ( a:var == 'dos' ) 
    return '[DOS]' 
  elseif ( a:var == 'mac' ) 
    return '[MAC]' 
  else 
    return '[UNIX]' 
  endif 
endfunction
"""""""""" tablabel
"""""""""" guitablabel
function! SimplifyPath(path)
  let slashed = Slashify(PathToShortHome(a:path))
  if len(slashed) < 10
    return slashed
  end
  let filename = substitute(slashed, '^.*/', '', "")
  let short = substitute(slashed, '/\(\(\W*\w\)[^\/]*\)', '/\2', "g")
  if stridx(short, "/") != 0
    let short = substitute(short, '^\(\(\W*\w\)[^\/]*\)', '\2', "g")
  end
  let short = substitute(short, '[^/]*$', '', "")

  return short . filename
endfunction

function! GuiTabLabel()
  let label = ''
  let tabnr = tabpagenr()
  let bufnrlist = tabpagebuflist(v:lnum)
  let wincount = tabpagewinnr(v:lnum, '$')
  let bufname = bufname(bufnrlist[tabpagewinnr(v:lnum) - 1])

  " is the current buffer modified?
  let has_changes = 0
  for bufnr in bufnrlist
    if getbufvar(bufnr, "&modified")
      let has_changes = 1
      break
    endif
  endfor

"  let label = tabnr
"  if wincount > 1
"    let label .= ':' . wincount
"  endif
  if has_changes == 1
    let label .= '+'
  end
  let label .= ' ' . SimplifyPath(bufname)

  return label
endfunction

set guitablabel=%{GuiTabLabel()}

""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""
"""""""""" KeyMap fu!
""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""
function! StrMatchNo(haystack, needle)
  let LastMatch = match(a:haystack, a:needle)
  if LastMatch > -1
    let Result = 1
    while LastMatch > -1
      let LastMatch = match(a:haystack, a:needle, LastMatch+1)
      if LastMatch > -1
        let Result = Result + 1
      endif
    endwhile
  else
    let Result = 0
  endif
  return Result
endfunction

" calls KeyMapExec for all combinations of modes and modifiers
function! KeyMap(modes, modifiers, key, action)
  if a:modes == ""
    if a:modifiers == ""
      call KeyMapExec(a:modes, a:modifiers, a:key, a:action)
    else
      for j in range(len(a:modifiers))
        call KeyMapExec(a:modes, a:modifiers[j], a:key, a:action)
      endfor
    endif
  else
    for i in range(len(a:modes))
      if a:modifiers == ""
        call KeyMapExec(a:modes[i], a:modifiers, a:key, a:action)
      else
        for j in range(len(a:modifiers))
          call KeyMapExec(a:modes[i], a:modifiers[j], a:key, a:action)
        endfor
      endif
    endfor
  endif
endfunction

" mode:     n,i,v
" modifier: C,D,L,M,S
" key:      a,<F2>,<Left>, etc
" action:   \o/
function! KeyMapExec(mode, modifier, key, action)
  if a:modifier=="D" && !has("macunix")
    return
  end
  " arg
  let s:arg = substitute(" <silent> ", "<>", "", "")

  " if no <CR>s or only one <CR> at end, use <C-o> to better preserve cursor position
  "   examples:
  "     gt
  "     :bd<CR>
  " otherwise, use <Esc> and a
  "   examples:
  "     :s/a/b/<CR>:s/c/d/<CR>
  "     :s/e/f/<CR>dd
  let crs = len(split(a:action, "<CR>"))
  if crs == 0 || (crs == 1 && a:action =~ '<CR>$')
    let s:pre = "<C-o>"
    let s:post = ""
  else
    let s:pre = "<Esc>"
    let s:post = "a"
  endif

  " put what to map in s:key
  let s:key = substitute(a:key, '[<>]', '', 'g')
  if a:modifier == ""
    let s:key = a:key
  elseif a:modifier == "L"
    let s:key = "<Leader>" . a:key
  else " C,D,M,S
    let s:key = "<" . a:modifier . "-" . s:key . ">"
  end

  	" put map in s:map
  let s:map = a:mode . "noremap" . s:arg .  s:key . " "
  if a:mode == "i"
    let s:map .= s:pre . a:action . s:post
  else
    let s:map .= a:action
  endif

  " \o/\O/\o/
  "echo s:map
  execute s:map

endfunction



""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""
"""""""""" yanked from http://ld.yi.org/vim/aedit.vim
""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""

" Utility functions
function! GetSynUnder()
	return synIDattr(synID(line('.'), col('.'), 1), 'name')
endfunction

function! GetCharUnder()
	return strpart(getline('.'), col('.') - 1, 1)
endfunction

function! GetCharBefore(offset)
	return strpart(getline('.'), col('.') - (a:offset + 1), 1)
endfunction

function! GetCharAfter()
	return strpart(getline('.'), col('.'), 1)
endfunction

function! AtEnd()
	return col('$') == col('.')
endfunction

function! GetStringBeforeCursor(offset)
	return strpart(getline('.'), 0, col('.') - a:offset)
endfunction

function! GetStringAfterCursor()
	return strpart(getline('.'), col('.'))
endfunction

function! GetWordBeforeCursor(keep_spaces)
	let regexp = '^.*\(\<\w\+\)'
	if !a:keep_spaces
		let regexp .= '\s*'
	endif
	let regexp .= '$'
	return substitute(GetStringBeforeCursor(0), regexp, '\1', '')
endfunction

function! GetExactWordBeforeCursor(offset)
  let x = matchlist(GetStringBeforeCursor(a:offset), '\(\w\w*\)\s*$')
  if len(x) > 0
    return x[1]
  else
    return GetStringBeforeCursor(a:offset)
  end
	"return substitute(GetStringBeforeCursor(a:offset), '^.*\(\w\w*\)\s*$', '\1', '')
endfunction

function! GetFirstWord()
	return substitute(getline('.'), '^\W*\(\<\w\+\).*$', '\1', '')
endfunction

function! CountOccurances(haystack, needle)
	let occurances = 0
	let lastpos = 0
	let firstiter = 1
	while lastpos > -1
		if firstiter
			let lastpos = match(a:haystack, a:needle, lastpos)
		else
			let lastpos = match(a:haystack, a:needle, lastpos + 1)
		endif
		let firstiter = 0
		if lastpos > -1
			let occurances = occurances + 1
		endif
	endwhile
	return occurances
endfunction

function! InsideTag()
	let str = GetStringBeforeCursor(0) . GetCharUnder()
	return str =~ '^.*<[^/>]*$'
endfunction

function! InsideQuote(char)
	let str = GetStringBeforeCursor(0) . GetCharUnder()
	if !InsideTag()
		let tags_complete = CountOccurances(str, '<[^/>]*>')
		let tags_incomplete = CountOccurances(str, '<\w')
		let tags = tags_incomplete - tags_complete
		return (CountOccurances(str, a:char) - tags) % 2 != 0
	else
		return CountOccurances(str, a:char) % 2 != 0
	endif
endfunction

" Lines
function! IsBlockStart(offset)
	if &ft == 'vim'
		if getline(line('.') + a:offset) =~ '^\s*endfun\w\+$'
			return 1
		endif
	else
		if getline(line('.') + a:offset) =~ '^\s*{$'
			return 1
		endif
	endif
	return 0
endfunction

function! IsFuncStart()
	if &ft == 'vim'
		return getline(line('.')) =~ '^\s*fun' && getline(line('.') + 1) =~ '^\s*endfun'
	else
		return getline(line('.')) =~ '^\s*function\>'
	endif
	return 0
endfunction

" Template and tag expansion
function! ExpandTemplate(ignore_quote)
	if a:ignore_quote || GetSynUnder() == 'htmlString' || (!InsideQuote("'") && !InsideQuote('"'))
		let cword = GetExactWordBeforeCursor(1)
		if exists('g:template' . &ft . cword)
			return "\<C-W>" . g:template{&ft}{cword}
		elseif exists('g:template_' . cword)
			return "\<C-W>" . g:template_{cword}
		endif
	endif
	return ExpandTag(' ')
endfunction

function! ExpandTag(char)
	if a:char == '>'
		if GetCharUnder() == '>'
			return "\<Right>"
		elseif GetCharBefore(1) == '>' && (&ft == 'php' || &ft == 'html')
			if &ft == 'php' && GetCharBefore(2) == '?'
				return '>'
			endif
			return "\<CR>\<CR>\<Up>\<Tab>"
		endif
	endif
	let sbefore = GetStringBeforeCursor(0)
	if GetCharUnder() == '>'
		return a:char
	endif
	if sbefore =~ '^.*<\w\+\S*$' && (&ft == 'php' || &ft == 'html')
		let cword = GetExactWordBeforeCursor(1)
		let sbefore1 = strpart(sbefore, 0, strlen(sbefore) - 1)
		if cword !~ '>' && CountOccurances(sbefore1, '<') > CountOccurances(sbefore1, '>')
			let cleft = repeat("\<Left>", len(cword) + 4)
			let retval = ''
			let close_tag = '></' . cword . '>' . cleft
			if cword == 'input' || cword == 'label' || cword == 'br' || cword == 'hr'
				let retval .= ">\<Left>"
			else
				let retval .= close_tag
			endif
			if a:char == ' '
				let retval = ' ' . retval
			else
				let retval .= "\<Right>"
			endif
			return retval
		endif
		return a:char
	endif
	return a:char
endfunction

" Visual mode functions
function! Enclose(mode, indent)
	if a:mode == '{'
		let start = '{'
		let end = '}'
	elseif a:mode == '/'
		let start = '/**'
		let end = '/**/'
	endif
	let extra = ''
	if a:indent
		let extra = "\<BS>"
	endif
	call cursor(line("'<"), col("'<"))
	execute "normal! O" . extra . start
	call cursor(line("'>"), col("'>"))
	execute "normal! o" . extra . end
endfunction

" Template utility functions
function! InsideShortPHP()
	return GetStringBeforeCursor(0) =~ '^.*<?[^p]'
endfunction

function! InsertLastFor()
	if len(g:last_for) > 0
		let html = ' name="' . g:last_for . '"'
		let g:last_for = ''
		return html
	endif
	return ''
endfunction

function! Yaml_to_spec()
  '<,'>s/^\w.*$/context "&" do\r  setup do\r  end\r/
  '<,'>s/:" do/" do/
  '<,'>s/^  - \(\w.*\)/  specify "\1" do\r  end\r/
  '<,'>s/\n\n\n/\rend\r\r/
ruby << EOF
=begin
  require 'yaml'
  def yaml_to_spec(yml)
    YAML.load(yml).inject(''){|t,(c,s)|
      t+(s ? %(context "#{c}" do)+s.map{|d|%(\n  xspecify "#{d}" do\n  end\n)}*''+"end\n\n":'')
    }.strip
  end
  b = VIM::Buffer.current
  b.append(b.count, yaml_to_spec("AAAAAAAAAA"))
=end
EOF
endfunction

function! VampRegisterToMap_(register)
  let keycodes = { 'ku': {'name': 'Up', 'meaning': 'arrow up'}, 'kd': {'name': 'Down', 'meaning': 'arrow down'}, 'kr': {'name': 'Right', 'meaning': 'arrow right'}, 'kl': {'name': 'Left', 'meaning': 'arrow left'}, '%i': {'name': 'S-Right', 'meaning': 'shift arrow right'}, '#4': {'name': 'S-Left', 'meaning': 'shift arrow left'}, 'k1': {'name': 'F1', 'meaning': 'function key 1'}, 'k2': {'name': 'F2', 'meaning': 'function key 2'}, 'k3': {'name': 'F3', 'meaning': 'function key 3'}, 'k4': {'name': 'F4', 'meaning': 'function key 4'}, 'k5': {'name': 'F5', 'meaning': 'function key 5'}, 'k6': {'name': 'F6', 'meaning': 'function key 6'}, 'k7': {'name': 'F7', 'meaning': 'function key 7'}, 'k8': {'name': 'F8', 'meaning': 'function key 8'}, 'k9': {'name': 'F9', 'meaning': 'function key 9'}, 'k;': {'name': 'F10', 'meaning': 'function key 10'}, 'F1': {'name': 'F11', 'meaning': 'function key 11'}, 'F2': {'name': 'F12', 'meaning': 'function key 12'}, 'F3': {'name': 'F13', 'meaning': 'function key 13'}, 'F4': {'name': 'F14', 'meaning': 'function key 14'}, 'F5': {'name': 'F15', 'meaning': 'function key 15'}, 'F6': {'name': 'F16', 'meaning': 'function key 16'}, 'F7': {'name': 'F17', 'meaning': 'function key 17'}, 'F8': {'name': 'F18', 'meaning': 'function key 18'}, 'F9': {'name': 'F19', 'meaning': 'function key 19'}, '%1': {'name': 'Help', 'meaning': 'help key'}, '&8': {'name': 'Undo', 'meaning': 'undo key'}, 'kI': {'name': 'Insert', 'meaning': 'insert key'}, 'kD': {'name': 'Del', 'meaning': 'delete key'}, 'kb': {'name': 'BS', 'meaning': 'backspace key'}, 'kB': {'name': 'S-Tab', 'meaning': 'back-tab (shift-tab)'}, 'kh': {'name': 'Home', 'meaning': 'home key'}, '#2': {'name': 'S-Home', 'meaning': 'shifted home key'}, '@7': {'name': 'End', 'meaning': 'end key'}, '*7': {'name': 'S-End', 'meaning': 'shifted end key'}, 'kP': {'name': 'PageUp', 'meaning': 'page-up key'}, 'kN': {'name': 'PageDown', 'meaning': 'page-down key'}, 'K1': {'name': 'kHome', 'meaning': 'keypad home key'}, 'K4': {'name': 'kEnd', 'meaning': 'keypad end key'}, 'K3': {'name': 'kPageUp', 'meaning': 'keypad page-up key'}, 'K5': {'name': 'kPageDown', 'meaning': 'keypad page-down key'}, 'K6': {'name': 'kPlus', 'meaning': 'keypad plus key'}, 'K7': {'name': 'kMinus', 'meaning': 'keypad minus key'}, 'K8': {'name': 'kDivide', 'meaning': 'keypad divide'}, 'K9': {'name': 'kMultiply', 'meaning': 'keypad multiply'}, 'KA': {'name': 'kEnter', 'meaning': 'keypad enter key'}, 'KB': {'name': 'kPoint', 'meaning': 'keypad decimal point'}, 'KC': {'name': 'k0', 'meaning': 'keypad 0'}, 'KD': {'name': 'k1', 'meaning': 'keypad 1'}, 'KE': {'name': 'k2', 'meaning': 'keypad 2'}, 'KF': {'name': 'k3', 'meaning': 'keypad 3'}, 'KG': {'name': 'k4', 'meaning': 'keypad 4'}, 'KH': {'name': 'k5', 'meaning': 'keypad 5'}, 'KI': {'name': 'k6', 'meaning': 'keypad 6'}, 'KJ': {'name': 'k7', 'meaning': 'keypad 7'}, 'KK': {'name': 'k8', 'meaning': 'keypad 8'}, 'KL': {'name': 'k9', 'meaning': 'keypad 9'} }

  let s = strtrans(eval("@" . a:register))
	for [code, details] in items(keycodes)
    " fuckin substitute()!
    " it eats the next char after the <80>
    " so i'm hacking it using strtrans
    "let s = substitute(s, "\\%x80" . key, "<" . value . ">", "g")
    "let s = substitute(s, "<80>" . code, "(" . details['meaning'] . ") ", "g")
    let s = substitute(s, "<80>" . code, "<" . details['name'] . ">", "g")
	endfor
  echo s
endfunction
command! -nargs=1  VampRegisterToMap :call VampRegisterToMap_(<args>)

