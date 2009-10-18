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

function! BrowserFromCurrentDir()
  " Explore deletes the quote register. Need to revive the mofo!
  " TODO check if still the case
  let g:OLDQUOTEREGISTER = @"
  let dirname = Slashify(expand('%:p:h'))
  call Tabnew()
  exec "Explore"
  let @" = g:OLDQUOTEREGISTER
endfunction

function! BrowserFromCurrentFilePath()
  let g:OLDQUOTEREGISTER = @"
  let dirname = Slashify(expand('%:p:h'))
  call Tabnew()
  exec "Explore " . dirname
  let @" = g:OLDQUOTEREGISTER
endfunction
