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
