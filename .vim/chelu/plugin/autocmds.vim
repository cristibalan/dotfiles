function! OnTabLeave()
  if UselessBuffer('%')
    bwipeout
  endif
endfunction
