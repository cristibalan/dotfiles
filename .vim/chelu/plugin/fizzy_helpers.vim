" TODO move to fuf-fizzy
function! FizzyReIndexCwd()
  call FizzyReIndex(getcwd())
endfunction
function! FizzyReIndex(dir)
  " if (a:dir =~ 'work\/projects\/\w\w*')
    echo "reindexing " . a:dir
    FizzyFileRenewCache
    FizzyDirRenewCache
  " endif
endfunction
