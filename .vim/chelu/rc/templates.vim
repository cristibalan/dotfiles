" generic templates
let g:template{'_'}{'lorem0'}  = "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
let g:template{'_'}{'lorem1'}  = "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur."
let g:template{'_'}{'lorem2'}  = "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
let g:template{'_'}{'lorem3'}  = "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
let g:template{'_'}{'lorem4'}  = "Lorem ipsum dolor sit amet, consectetur adipisicing elit"
let g:template{'_'}{'lorem5'}  = "Lorem ipsum dolor sit amet"
let g:template{'_'}{'lorem6'}  = "Lorem ipsum"
let g:template{'_'}{'lorem'}  = g:template{'_'}{'lorem0'}

" Vim templates
let g:template{'vim'}{'fun'} = "function! ()\<CR>endfunction\<Up>\<End>\<Left>\<Left>"

" rails - erb
let g:template{'_'}{'rr'}  = "<%  %>\<Left>\<Left>\<Left>"
let g:template{'_'}{'ree'}  = "<%=  %>\<Left>\<Left>\<Left>"
" let g:template{'_'}{'rrr'} = "<%  -%>\<Left>\<Left>\<Left>"
" let g:template{'_'}{'rre'} = "<%=  -%>\<Left>\<Left>\<Left>"
let g:template{'_'}{'cc'} = "/*  */\<Left>\<Left>\<Left>"
let g:template{'_'}{'hh'} = "<!--  -->\<Left>\<Left>\<Left>\<Left>"
" let g:template{'_'}{'le'} = "{{  }}\<Left>\<Left>\<Left>"
" let g:template{'_'}{'lll'} = "{%  %}\<Left>\<Left>\<Left>"

" rails rspec
let g:template{'ruby'}{'rde'} = "describe \"\" do\n  \n\<BS>end\n\<Up>\<Up>\<Up>" . repeat("\<RIGHT>", 10)
let g:template{'ruby'}{'rit'} = "it \"should \" do\n  \n\<BS>end\n\<BS>\<Up>\<Up>\<Up>" . repeat("\<RIGHT>", 13)
let g:template{'ruby'}{'rbe'} = "before do\n  \n\<BS>end\n\<Up>\<Up>" . repeat("\<RIGHT>", 2)
let g:template{'ruby'}{'rbea'} = "before do\n  \n\<BS>end\n\<Up>\<Up>" . repeat("\<RIGHT>", 2)
let g:template{'ruby'}{'rhe'} = "module SpecHelper\<CR>  def valid_attributes\<CR>  {\<CR>  : => '',\<CR>\<BS>}\<CR>\<BS>end\<CR>\<BS>end\<CR>" . repeat("\<UP>", 7) . repeat("\<RIGHT>", 7)

" css
let g:template{'css'}{'cl'}  = ". {\<CR>  \<CR>\<BS>}\<UP>\<UP>"
let g:template{'css'}{'id'}  = "# {\<CR>  \<CR>\<BS>}\<UP>\<UP>"
let g:template{'css'}{'ta'}  = " {\<CR> \<CR>\<BS>}\<UP>\<UP>\<Left>"
let g:template{'css'}{'fl'}  = "float: left;\<CR>display: inline;\<CR>"
let g:template{'css'}{'fr'}  = "float: right;\<CR>display: inline;\<CR>"
let g:template{'css'}{'bg'}  = "background: url(../images/.gif) left top no-repeat;" . repeat("\<Left>", 25)
let g:template{'css'}{'bgi'} = "background-image: url(../images/.gif);" . repeat("\<Left>", 6)
let g:template{'css'}{'bgc'} = "background-color: #;\<Left>"
let g:template{'css'}{'bn'}  = "background: none;"
let g:template{'css'}{'bo'}  = "border: solid 1px #;\<Left>"
let g:template{'css'}{'c'}   = "color: #;\<Left>"
let g:template{'css'}{'fs'}  = "font-size: em;\<Left>\<Left>\<Left>"
let g:template{'css'}{'fb'}  = "font-weight: bold;"
let g:template{'css'}{'fn'}  = "font-weight: normal;"
let g:template{'css'}{'di'}  = "display: inline;"
let g:template{'css'}{'db'}  = "display: block;"
let g:template{'css'}{'dn'}  = "display: none;"
let g:template{'css'}{'pa'}  = "position: absolute;"
let g:template{'css'}{'pr'}  = "position: relative;"
let g:template{'css'}{'tu'}  = "text-decoration: underline;"
let g:template{'css'}{'tn'}  = "text-decoration: none;"
let g:template{'css'}{'vm'}  = "vertical-align: middle;"

" sass
let g:template{'sass'}{'fl'}  = "float: left\<CR>display: inline\<CR>"
let g:template{'sass'}{'fr'}  = "float: right\<CR>display: inline\<CR>"
let g:template{'sass'}{'bg'}  = "background: url(../images/.gif) left top no-repeat" . repeat("\<Left>", 24)
let g:template{'sass'}{'bgi'} = "background-image: url(../images/.gif)" . repeat("\<Left>", 5)
let g:template{'sass'}{'bgc'} = "background-color: #"
let g:template{'sass'}{'bn'}  = "background: none"
let g:template{'sass'}{'bo'}  = "border: solid 1px #"
let g:template{'sass'}{'c'}   = "color: #"
let g:template{'sass'}{'fs'}  = "font-size: em\<Left>\<Left>"
let g:template{'sass'}{'fb'}  = "font-weight: bold"
let g:template{'sass'}{'fn'}  = "font-weight: normal"
let g:template{'sass'}{'di'}  = "display: inline"
let g:template{'sass'}{'db'}  = "display: block"
let g:template{'sass'}{'dn'}  = "display: none"
let g:template{'sass'}{'pa'}  = "position: absolute"
let g:template{'sass'}{'pr'}  = "position: relative"
let g:template{'sass'}{'tu'}  = "text-decoration: underline"
let g:template{'sass'}{'tn'}  = "text-decoration: none"
let g:template{'sass'}{'vm'}  = "vertical-align: middle"

" js
let g:template{'javascript'}{'eachf'}  = "each(function(){\n  \n\<BS>});\<Up>\<Up>\<End>\<Left>\<Left>"
let g:template{'javascript'}{'funo'}  = "function(){\n  \n\<BS>}\<Up>\<Up>\<End>\<Left>\<Left>"
