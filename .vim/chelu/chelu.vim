""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""
"""""""""" event handlers
""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""
function! BufEnter()
  call CdReset()
  " call GuiSizeSet(g:CURRENTSIZE)
endfunction

" function! TabLeave()
  " if ((getbufvar("%", "&mod") == 0) && (bufname("%") == '' || bufname("%") == '[No Name]' || bufname("%") == '[No File]'))
    " :bwipeout
  " endif
" endfunction

" function! VimLeave()
  " :1,255bwipeout
" endfunction

