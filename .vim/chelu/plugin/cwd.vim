let g:CWD = ""
function! Cd(cd)
  exec 'cd ' . escape(a:cd, " ")
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
