"=============================================================================
" Copyright (c) 2007-2009 Cristi Balan
"
" This file is based on fuf/file.vim.
" 
" The only changes are the onInit and onComplete functions and the removal of 
" s:enumItems.
"
" Put this file in autoload/ and make sure your .vimrc g:fuf_modes mentions fizzyfile.
" let g:fuf_modes = ['fizzyfile', 'fizzydir']
"
"=============================================================================
" LOAD GUARD {{{1

if exists('g:loaded_autoload_fuf_fizzydir') || v:version < 702
  finish
endif
let g:loaded_autoload_fuf_fizzydir = 1

" }}}1
"=============================================================================
" GLOBAL FUNCTIONS {{{1

"
function fuf#fizzydir#createHandler(base)
  return a:base.concretize(copy(s:handler))
endfunction

"
function fuf#fizzydir#renewCache()
endfunction

"
function fuf#fizzydir#requiresOnCommandPre()
  return 0
endfunction

command! FizzyDirRenewCache ruby refresh_fizzydir_finder

"
function fuf#fizzydir#onInit()
ruby << RUBY
  begin
    require "#{ENV['HOME']}/.vim/ruby/fizzy"
  rescue LoadError
    begin
      require 'rubygems'
      require 'fizzy'
    rescue LoadError
      puts 'Could not load fizzy. Get fizzy from http://github.com/evilchelu/fizzy'
    end
  end

  def fizzydir_finder
    @fizzydir_finder ||= begin
      cmd = 'find -d . -type d -not -path "*.git*" -not -path "*vendor/*" -not -path "*public/a/*" | sed -e "s/^\.\///"'
      Fizzy.new(`#{cmd}`.map{|f|f.chomp})
    end
  end

  def refresh_fizzydir_finder
    @fizzydir_finder = nil
    fizzydir_finder
    nil
  end
RUBY
  call fuf#defineLaunchCommand('FufFizzyDir', s:MODE_NAME, '""')
endfunction

" }}}1
"=============================================================================
" LOCAL FUNCTIONS/VARIABLES {{{1

let s:MODE_NAME = expand('<sfile>:t:r')

" }}}1
"=============================================================================
" s:handler {{{1

let s:handler = {}

"
function s:handler.getModeName()
  return s:MODE_NAME
endfunction

"
function s:handler.getPrompt()
  return g:fuf_file_prompt
endfunction

"
function s:handler.getPromptHighlight()
  return g:fuf_file_promptHighlight
endfunction

"
function s:handler.targetsPath()
  return 1
endfunction

"
function s:handler.onComplete(patternSet)
  let result = []
  ruby << RUBY
    pattern = VIM.evaluate("a:patternSet['raw']")
    res = fizzydir_finder.fuf_find(pattern)
    res.each_with_index do |r, index|
      VIM.evaluate("add(result, { 'word': #{r[:word].inspect}, 'abbr': #{r[:abbr].inspect}, 'menu': #{r[:menu].inspect}, 'ranks': [#{index}] })")
    end
RUBY
  return result
endfunction

"
function s:handler.onOpen(expr, mode)
  call fuf#openFile(a:expr, a:mode, g:fuf_reuseWindow)
endfunction

"
function s:handler.onModeEnterPre()
endfunction

"
function s:handler.onModeEnterPost()
  let self.cache = {}
endfunction

"
function s:handler.onModeLeavePost(opened)
endfunction

" }}}1
"=============================================================================
" vim: set fdm=marker:


