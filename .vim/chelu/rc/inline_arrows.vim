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
