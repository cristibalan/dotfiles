function! GuiEnter()
  if has("macunix")
    " call GuiSizeSet(g:CURRENTSIZE)
  endif
endfunction

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


