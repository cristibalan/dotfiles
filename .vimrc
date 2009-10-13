""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""
"""""""""" yarr! this be chelu's .vimrc
""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""

"""""""""" TOC

""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""
"""""""""" Set paths and what plugins are available
""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""

" :h mac-faq
if has("macunix") && has("gui_running") && system('ps xw | grep -c "[V]im -psn"') > 0
  " Get the value of $PATH from a login shell.
  if $SHELL =~ '/\(sh\|csh\|bash\|tcsh\|zsh\)$'
    let s:path = system("echo echo VIMPATH'${PATH}' | $SHELL -l")
    let $PATH = matchstr(s:path, 'VIMPATH\zs.\{-}\ze\n')
  endif
endif

" user paths
set runtimepath=$HOME/.vim/vimfiles
set runtimepath+=$HOME/.vim/chelu

set runtimepath+=$HOME/.vim/fuf
set runtimepath+=$HOME/.vim/fuf-fizzy
set runtimepath+=$HOME/.vim/NERD_commenter
set runtimepath+=$HOME/.vim/matchit
set runtimepath+=$HOME/.vim/surround

set runtimepath+=$HOME/.vim/ruby

" maybe enable
" set runtimepath+=$HOME/.vim/taglist
" set runtimepath+=$HOME/.vim/editexisting

" maybe get
" set runtimepath+=$HOME/.vim/allml
" set runtimepath+=$HOME/.vim/rails
" imaps.vim

" $VIM paths & after paths
set runtimepath+=$VIM/vimfiles,$VIMRUNTIME,$VIM/vimfiles/after

" user after paths
" set runtimepath+=one for each plugin
set runtimepath+=$HOME/.vim/vimfiles/after

" disable some built in plugins to avoid the kitchen sink effect :p
let g:loaded_matchparen = 1       " disable matching of braces when moving around, it's too slow
let loaded_gzip = 1              " disable editing of compressed files
let g:loaded_tarPlugin = 1       " disable browsing of tar files
let g:loaded_zipPlugin = 1       " disable browsing of zip files
let g:loaded_getscriptPlugin = 1 " disable GLVS plugin
let g:loaded_vimballPlugin = 1   " disable vimball plugin


""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""
"""""""""" Load config
""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""
source $HOME/.vim/chelu/plugin/keymap.vim


""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""
"""""""""" Base settings you don't need to care about
""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""

" save temporary backups only when saving, but not in the same directory
set nobackup
set writebackup
set directory=$HOME/tmp/vim,$HOME/tmp,/var/tmp,/tmp,$TMP,$TEMP

" use VI incompatible features (most plugins don't run without it)
set nocompatible

" no menus! if this doesn't work, put it in after/menu.vim. or try to run $VIMRUNTIME/delmenu.vim often
let did_install_default_menus=1 " pretend that menus are already loaded
let did_install_syntax_menu=1   " pretend that the syntax menu was already loaded
set guioptions-=m               " hide menubar
" remove all menus
aunmenu *
set langmenu=none               " always use english menus at least


""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""
"""""""""" Basic settings
""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""
syntax enable
filetype plugin indent on
" filetype plugin on
set ffs=unix,dos,mac          " prefer unix line endings

"""""""""" general
set cpoptions+=I              " keep autoindent - doesn't seem to work tho
set autoread                  " read outside modified files
set encoding=UTF-8
set history=10000             " number of history items
set undolevels=10000
set viminfo=%,h,'1000,"1000,:1000,n~/.viminfo
set writeany                  " write on readonly files
set modelines=0               " disable modelines

"""""""""" searches
set gdefault                  " global search/replace by default
set ignorecase                " ignore case when searching
set smartcase                 " ignore case when searching smarter
set hlsearch                  " highlight last search
set incsearch                 " show matches while searching

"""""""""" behave 'mswin/xterm'-ish
set selectmode=mouse ",key      " when to enter SELECT mode
set mousemodel=popup
set keymodel=startsel ",stopsel " what to do when moving with SHIFT
set selection=exclusive         " exclusive is windows style

set mousehide
set mouse=a
set winaltkeys=no

"""""""""" input behavior
set formatoptions=tcroqn1       " text autoformatting options
set nostartofline               " don't move to start of line after commands
set backspace=eol,start,indent  " backspace over everything
set whichwrap=<,>,h,l,b,s,~,[,]
set iskeyword=@,48-57,128-167,224-235,_  "default: @,48-57,_,192-255
set listchars=tab:>.,trail:.,extends:>,precedes:<,eol:$

"""""""""" visual
set guioptions=aAceimMgrb     " aA BAD (autocopy modeless selection to clipboard)?
set number                    " show line numbers
set laststatus=2              " always show status line
set scrolloff=4               " minlines to show around cursor
set sidescrolloff=4           " minchars to show around cursor
set shortmess=asTIA           " supress some file messages
set linebreak                 " when wrapping, try to break at characters in breakat
set breakat=\ ^I!@*-+;:,./?   " when wrapping, break at these characters
set showbreak=>               " character to show that a line is wrapped
set showcmd                   " show number of selected chars/lines in status
set showmatch                 " briefly jump to matching brace
set matchtime=1               " show matching brace time (1/10 seconds)
set showmode                  " show mode in status when not in normal mode
set virtualedit=block         " allow moving past end of line in block selection mode
set wildmenu                  " nice menu when completing commands
set wildmode=list:longest,full
" set cursorline                " highlight cursor line
" set cursorcolumn              " highlight cursor column

set noerrorbells
set visualbell                " must turn visual bell on to remove audio bell
set t_vb=                     " turn bells off, must also set this in .gvimrc

"""""""""" statusline, windows, tab pages, buffers
set statusline=%-2(%M\ %)%5l,%-5v%<%f\ %m\ \ %{hostname()}:%r%{CwdShort()}%=%(%-5([%R%H%W]\ %)\ %10([%Y]%{ShowFileFormatFlag(&fileformat)}\ %)\ %L\ lines%)
set showtabline=2

" TODO
" see help for these functions
"set tabline=%!MyTabLine()
" guitablabel is ignored :/
" set guitablabel=%M%t
"set guitablabel=%N\ %f
"set guitablabel=%{GuiTabLabel()}

set switchbuf=usetab
set tabpagemax=100
set noequalalways
set guiheadroom=0
set hidden
set splitbelow                " split windows below current one
set title



""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""
"""""""""" User options you might actually care about
""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""
if has("macunix")
  set fuoptions=maxvert,maxhorz
  set antialias
endif

set guifont=Monaco:h13
set linespace=0                 " spacing between lines if font is too crowded

colorscheme desert
" colorscheme macvim

" TODO ?
"""""""""" tabs and spaces
set expandtab
set autoindent nocindent nosmartindent
set indentexpr=
set tabstop=2
set shiftwidth=2
set softtabstop=2

""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""
"""""""""" Plugin settings
""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""
"""""""""" netrw
let g:netrw_browsex_viewer="open"
"""""""""" fuzzyfinder (fuf) & fuf-fizzy
let g:fuf_modes = ['fizzyfile', 'fizzydir', 'buffer', 'tag']

"""""""""" NERDCommenter settings
map <space><space> <plug>NERDCommenterToggle
let g:NERDRemoveExtraSpaces=1
let g:NERDSpaceDelims=1
let g:NERDMenuMode=0
let g:NERDCreateDefaultMappings=0


"""""""""" TOhtml
let use_xhtml = 1
let html_number_lines = 0
let html_ignore_folding = 1
let html_use_css = 1


"""""""""" taglist settings
let Tlist_Compact_Format = 1
let Tlist_File_Fold_Auto_Close = 1
let Tlist_Use_Right_Window = 1
let Tlist_Exit_OnlyWindow = 1
let Tlist_WinWidth = 40 

"""""""""" NERDTree settings
let NERDTreeChDirMode = 0 " don't change dirs
let NERDTreeWinSize = 60

"""""""""" allml
" inoremap <M-o>       <Esc>o
" inoremap <C-j>       <Down>
" let g:allml_global_maps = 1



""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""
"""""""""" autocmds
""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""

"au! BufWritePre * :%s/\s\+$//e

"autocmd BufNewFile,BufReadPre * call CHELU_spaces()
" autocmd GUIEnter              * call GuiEnter()
" autocmd BufEnter              * call BufEnter()
" autocmd TabLeave              * call TabLeave()
if has("macunix")
  "autocmd BufLeave             * call TabLeave()
endif
" autocmd VimLeavePre           * call VimLeave()



""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""
"""""""""" commands
""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""
command! W :up
command! WW :browse confirm saveas
command! Wq :wq
command! Q :q

" Use :C blah.txt in a netrw browser to create a new file
command! -nargs=1 -complete=file C :call CreateNewFile(<f-args>)



""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""
"""""""""" MAPPINGS
""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""
" TODO check $VIMRUNTIME/macmap.vim
let mapleader = "`"
let maplocalleader = "|"

"""""""""" macvim
if has("gui_macvim")
  " let macvim_skip_cmd_opt_movement = 1
  " let macvim_hig_shift_movement = 1
endif

"""""""""" disable middle mouse button pasting
map   <MiddleMouse>    <Nop>
map   <2-MiddleMouse>  <Nop>
map   <3-MiddleMouse>  <Nop>
map   <4-MiddleMouse>  <Nop>
imap  <MiddleMouse>    <Nop>
imap  <2-MiddleMouse>  <Nop>
imap  <3-MiddleMouse>  <Nop>
imap  <4-MiddleMouse>  <Nop>



""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""
"""""""""" MAPPINGS
""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""
"""""""""" shortcuts
call KeyMap('n',  '',    'TT',       '::tabnew<CR>:e ~/todo/today.txt<CR>')
" call KeyMap('ni', 'CDLM', 'p',       ':TlistToggle<CR>')

"""""""""" font size
call KeyMap('n', 'L', 'k',   ':call GuiSizeNext()<CR>')
call KeyMap('n', 'L', 'K',   ':call GuiSizePrev()<CR>')
call KeyMap('n', 'M', 'F11', ':call ToggleFullSCreen()<CR>')

"""""""""" tabs
call KeyMap('n', 'DL', '1',       '1gt')
call KeyMap('n', 'DL', '2',       '2gt')
call KeyMap('n', 'DL', '3',       '3gt')
call KeyMap('n', 'DL', '4',       '4gt')
call KeyMap('n', 'DL', '5',       '5gt')
call KeyMap('n', 'DL', '6',       '6gt')
call KeyMap('n', 'DL', '7',       '7gt')
call KeyMap('n', 'DL', '8',       '8gt')
call KeyMap('n', 'DL', '9',       '9gt')
" call KeyMap('n', 'DL', 't',       ':tabnew<CR>:tabmove<CR>')
call KeyMap('n', 'DL', 't',       ':tabnew<CR>')
" call KeyMap('n', 'DL', ']',       'gt')
" call KeyMap('n', 'DL', '[',       'gT')
call KeyMap('n', 'DL', '}',       'gt')
call KeyMap('n', 'DL', '{',       'gT')
call KeyMap('n', 'DL', '<Left>',  'gT')
call KeyMap('n', 'DL', '<Right>', 'gt')
call KeyMap('n', 'D',  '<M-Left>',  ':call MoveTabLeft()<CR>')
call KeyMap('n', 'D',  '<M-Right>', ':call MoveTabRight()<CR>')

"""""""""" cwd manipulation
call KeyMap('n',  'L', '-', ':call CwdUp()<CR>')
call KeyMap('n',  'L', '=', ':call CwdDown()<CR>')
call KeyMap('n',  'L', '0', ':call CwdCurrent()<CR>')

"""""""""" windows, buffers and files
call KeyMap('ni', 'D', 's', ':up<CR>')
call KeyMap('ni', 'D', 'w', ':bw<CR>')
call KeyMap('ni', 'D', 'b', ':tab ball<CR>:tab ball<CR>:tab ball<CR>')
call KeyMap('n', 'L', 'q',  ':q<CR>')
call KeyMap('n', 'L', 's',  ':up<CR>')
call KeyMap('n', 'L', 'w',  ':bw<CR>')
call KeyMap('n', 'L', 'b',  ':tab ball<CR>:tab ball<CR>:tab ball<CR>')

"""""""""" directory browsing
call KeyMap('n', 'DL', 'e', ':call BrowserFromCurrentDir()<CR>')      " open a file browser in a new tab
call KeyMap('n', 'DL', 'E', ':call BrowserFromCurrentFilePath()<CR>') " open a file browser in a new tab
"call KeyMap('n', 'L',    'f',       ':let @+ = expand("%:p")<CR>')    " copy current filename in clipboard
"call KeyMap('n', 'L',    'x',       ':ExtractFileToTabpage()<CR>')    " extract current file to a new buffer

"""""""""" fuf-fizzy
call KeyMap('n', 'DL', 'r', ':tabnew<CR>:FufFizzyFile<CR>')
call KeyMap('n', 'DL', 'R', ':tabnew<CR>:FufFizzyDir<CR>')
call KeyMap('n', 'DL', '\', ':call FizzyReIndexCwd()<CR>')

"""""""""" selections
call KeyMap('n',  'D', 'a' ,      'ggVG')
call KeyMap('ni', '',  '<F2>',    ':let @/ = ""\|nohlsearch<CR>')
" select just pasted text
nnoremap gb '[V']

"""""""""" toggle switches
call KeyMap('n', 'L',    'a',       ':set wrap!<CR>')
call KeyMap('n', 'L',    'l',       ':set list!<CR>')
call KeyMap('n', 'L',    'p',       ':set paste!<CR>')

"""""""""" indenting
" TODO check with template expansion
" TODO check if works in normal mode
call KeyMap('v',  '',     '<Tab>',   '>gv')
call KeyMap('v',  'S',    '<Tab>',   '<gv')
call KeyMap('v',  '',     '>>',   '>gv')
call KeyMap('v',  '',     '<<',   '<gv')
" TODO ?
inoremap <silent> <S-Tab> <C-o><<<C-o>^

"""""""""" swap lines
call KeyMap('ni', 'M',    '<Up>',    ':call SwapUp()<CR>')
call KeyMap('ni', 'M',    '<Down>',  ':call SwapDown()<CR>')

"""""""""" expansions
"inoremap <silent> <Space> <C-R>=ExpandTemplate(1)<CR>
"inoremap <silent> > <C-R>=ExpandTag('>')<CR>
inoremap <C-space> <C-p>

"""""""""" <3 _
" helpers to use _ like a word boundary
" TODO maybe use smartcase.vim
nnoremap cr  ct_
nnoremap vr  vt_
nnoremap yr  yt_
nnoremap dr  dt_
nnoremap gur gut_
nnoremap gUr gUt_

nnoremap car  bct_
nnoremap var  bvt_
nnoremap yar  byt_
nnoremap dar  bdt_
nnoremap guar bgut_
nnoremap gUar bgUt_

nnoremap cir  F_lct_
nnoremap vir  F_lvt_
nnoremap yir  F_lyt_
nnoremap dir  F_ldt_
nnoremap guir F_lgut_
nnoremap gUir F_lgUt_

" TODO ?!
" nnoremap >t vat>
" nnoremap <t vat<

"""""""""" random
" don't lose indent, but makes file dirty on each edit
" inoremap <ESC> <TAB><BS><ESC>
" C-o & C-O form insert mode
inoremap <S-CR> <C-o>o
inoremap <D-CR> <C-o>O

"""""""""" other random TODO ?
" echo highlight group at cursor location
map <leader>hl  :echo "hi<" . synIDattr(synID(line("."),col("."),1),"name") . '> trans<' . synIDattr(synID(line("."),col("."),0),"name") . "> lo<" . synIDattr(synIDtrans(synID(line("."),col("."),1)),"name") . ">"<CR>

" Enclose
"vnoremap <silent> <M-{> >gv:<C-u>call Enclose('{', 1)<CR>
"vnoremap <silent> <M-/> :<C-u>call Enclose('/', 0)<CR>

" Execute last command
"inoremap <M-:> <C-o>:echo ':' . @: \| execute @:<CR>
"nnoremap <M-:> :echo ':' . @: \| execute @:<CR>

" remove duplicate newlines and whitespace
" call KeyMap('n',  'L',    'r',       ':%s/\n\n/\r/<CR>')
" call KeyMap('v',  'L',    'r',       ':s/\n\n/\r/<CR>')
" call KeyMap('n',  'L',    'R',       ':%s/\s\s*$//<CR>')
" call KeyMap('v',  'L',    'R',       ':s/\s\s*//<CR>')

" format sql
" :%s/\(FROM\|LEFT\|RIGHT\|INNER\|WHERE\|GROUP\|ORDER\|LIMIT,\)/\r<CR>:%s/\(AND\|,\)/&\r<CR>
