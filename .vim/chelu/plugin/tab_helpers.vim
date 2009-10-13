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
