export BRAID_USE_LOCAL_CACHE=yes

bind Space:magic-space

export PATH=/usr/local/bin:$PATH
export PATH=/usr/local/mysql/bin:$PATH
export PATH=/usr/local/share/npm/bin:$PATH
#export PATH=/opt/local/bin:/opt/local/sbin:$PATH

# export PATH=~/work/projects/kicker/bin:$PATH
export PATH=~/work/gems/braid/bin:$PATH
export PATH=~/work/sdk/air/bin:$PATH
export PATH=~/bin:$PATH
export PATH=~/bin/chelu/ws:$PATH
export PATH=~/bin/chelu:$PATH
export PATH=~/src/s3sync:$PATH

export PATH=~/work/checkouts/one_inch_punch/bin:$PATH
export PATH=~/work/projects/braid/bin:$PATH
export PATH=~/dotfiles:$PATH

export CLASSPATH="/Users/chelu/classpath:/Users/chelu/classpath/js.jar:$CLASSPATH"

export MANPATH=/opt/local/share/man:$MANPATH
export MANPATH=~/man:$MANPATH
export SUDOLESS=true
export MERB_SUDO=

# in case git colors fuck up
export LESS="-rX"

# imagemagick
export MAGICK_HOME="/opt/imagemagick"
export PATH="$MAGICK_HOME/bin:$PATH"
export DYLD_LIBRARY_PATH="$MAGICK_HOME/lib"

. ~/bin/aliases

# don't use gems as root
#alias gemi='gem install --no-rdoc --no-ri -y'
#alias gemi='gem install -y'
export GEM_HOME="/usr/local/Cellar/gems/1.8"
export GEM_PATH="$GEM_HOME"

export DISPLAY=:0.0
export EDITOR=g
export GIT_EDITOR=gw
# export EDITOR=’mvim -f -c “au VimLeave * !open -a Terminal”‘
export PAGER=less
export VIM_APP_DIR=~/Apps/must\ have
export INPUTRC=~/.inputrc

export HISTCONTROL=erasedups
export HISTSIZE=1000000
shopt -s histappend

shopt -s checkwinsize

# hack && ship
function current_git_branch {
  git branch 2> /dev/null | grep '\*' | awk '{print $2}'
}
 
hack()
{
  CURRENT=$(current_git_branch)
  git checkout master
  git pull origin master
  git checkout ${CURRENT}
  git rebase master
  unset CURRENT
}
 
ship()
{
  CURRENT=$(current_git_branch)
  git checkout master
  git merge ${CURRENT}
  git push origin master
  git checkout ${CURRENT}
  unset CURRENT
}


# completion
complete -C ~/.bash_completion.d/rake-complete.rb -o default rake
source ~/.bash_completion.d/git-completion.bash
complete -o default -o nospace -F _git gh


function git_current_branch {
  git branch 2>/dev/null | awk '/^\* /{print $2 }'
}
function git_dirty {
  git st 2> /dev/null | grep -c : | awk '{if ($1 > 0) print "*"}'
}
function git_formatted_current_branch_with_dirty {
  if [ -n "$(git_current_branch)" ]; then
    echo " ($(git_current_branch)$(git_dirty))"
  fi
  #awk '{if ($(git_current_branch)) print " (" $(git_current_branch)$(git_dirty) ")"}'
}
function dollar_or_pound {
  if [ $(whoami) == "root" ]; then
    echo "#"
  else
    echo "$"
  fi
}
# bleh, el ugly :/
function git_status {
  if [ -n "$(git status 2>/dev/null)" ]; then
    #echo "$(git status 2>/dev/null)"
    echo "["
  else
    echo "["
  fi
}
export PS1="\$(git_status)\u@\h \w\$(git_formatted_current_branch_with_dirty)]\$(dollar_or_pound) "

#export PROMPT_COMMAND='echo -ne "\033]0;${USER}@${HOSTNAME%%.*}:${PWD/#$HOME/~} `git-branch 2>&1 | grep "*" | awk -F" " "{print $2}"`"; echo -ne "\007"' 
#Update
#If you have git bash_completion installed, you can modify your PROMPT_COMMAND to this:
#export PROMPT_COMMAND='echo -ne "\033]0;${PWD/#$HOME/~} $(__git_ps1 " (%s)")"; echo -ne "\007"'

# function parse_git_branch {
  # [ -d .git ] || return 1
  # git_status="$(git status 2> /dev/null)"
  # branch_pattern="^# On branch ([^${IFS}]*)"
  # remote_pattern="# Your branch is (.*) of"
  # diverge_pattern="# Your branch and (.*) have diverged"
  # if [[ ! ${git_status}} =~ "working directory clean" ]]; then
    # state="*"
  # fi
  # # add an else if or two here if you want to get more specific
  # if [[ ${git_status} =~ ${remote_pattern} ]]; then
    # if [[ ${BASH_REMATCH[1]} == "ahead" ]]; then
      # remote="↑"
    # else
      # remote="↓"
    # fi
  # fi
  # if [[ ${git_status} =~ ${diverge_pattern} ]]; then
    # remote="↕"
  # fi
  # if [[ ${git_status} =~ ${branch_pattern} ]]; then
    # branch=${BASH_REMATCH[1]}
    # echo " <${branch}${state}${remote}>"
  # fi
# }

        # RED="\[\033[0;31m\]"
     # YELLOW="\[\033[0;33m\]"
     # GREEN="\[\033[0;32m\]"
       # BLUE="\[\033[0;34m\]"
  # LIGHT_RED="\[\033[1;31m\]"
# LIGHT_GREEN="\[\033[1;32m\]"
      # WHITE="\[\033[1;37m\]"
 # LIGHT_GRAY="\[\033[0;37m\]"
 # COLOR_NONE="\[\e[0m\]"
 
# function parse_git_branch {
 
  # git rev-parse --git-dir &> /dev/null
  # git_status="$(git status 2> /dev/null)"
  # branch_pattern="^# On branch ([^${IFS}]*)"
  # remote_pattern="# Your branch is (.*) of"
  # diverge_pattern="# Your branch and (.*) have diverged"
  # if [[ ! ${git_status}} =~ "working directory clean" ]]; then
    # state="${RED}⚡"
  # fi
  # # add an else if or two here if you want to get more specific
  # if [[ ${git_status} =~ ${remote_pattern} ]]; then
    # if [[ ${BASH_REMATCH[1]} == "ahead" ]]; then
      # remote="${YELLOW}↑"
    # else
      # remote="${YELLOW}↓"
    # fi
  # fi
  # if [[ ${git_status} =~ ${diverge_pattern} ]]; then
    # remote="${YELLOW}↕"
  # fi
  # if [[ ${git_status} =~ ${branch_pattern} ]]; then
    # branch=${BASH_REMATCH[1]}
    # echo " (${branch})${remote}${state}"
  # fi
# }
 
# function prompt_func() {
    # previous_return_value=$?;
    # # prompt="${TITLEBAR}$BLUE[$RED\w$GREEN$(__git_ps1)$YELLOW$(git_dirty_flag)$BLUE]$COLOR_NONE "
    # prompt="${TITLEBAR}${BLUE}[${RED}\w${GREEN}$(parse_git_branch)${BLUE}]${COLOR_NONE} "
    # if test $previous_return_value -eq 0
    # then
        # PS1="${prompt}➔ "
    # else
        # PS1="${prompt}${RED}➔${COLOR_NONE} "
    # fi
# }
 
# PROMPT_COMMAND=prompt_func

# http://gist.github.com/48207


# this must be after we set PS1
# http://github.com/rupa/j/tree/master
source ~/bin/chelu/j.sh

# TODO move these to some other file
gemdoc() {
  local gemdir=`gem env gemdir`
  open $gemdir/doc/`ls $gemdir/doc/ | grep $1 | sort | tail -1`/rdoc/index.html
}
gemcd() {
  local gemdir=`gem env gemdir`
  cd $gemdir/gems/$1
}

_gemsomplete() {
  COMPREPLY=($(compgen -W '$(ls `gem env gemdir`/gems)' -- ${COMP_WORDS[COMP_CWORD]}))
  return 0
}

complete -o default -o nospace -F _gemsomplete gemdoc
complete -o default -o nospace -F _gemsomplete gemcd

if [[ -s /Users/chelu/.rvm/scripts/rvm ]] ; then source /Users/chelu/.rvm/scripts/rvm ; fi
