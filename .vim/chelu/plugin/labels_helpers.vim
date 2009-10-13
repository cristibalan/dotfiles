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
