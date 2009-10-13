""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""
"""""""""" KeyMap fu!
""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""
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
