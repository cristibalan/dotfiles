#git plugin
alias gl='git log'
compdef _git gl=git-log
alias ga='git add'
compdef _git ga=git-add
alias gd='git diff'
compdef _git gd=git-diff
alias gdc='git diff --cached'
compdef _git gdc=git-diff
alias gr='git rebase'
compdef _git gr=git-rebase
alias gri='git rebase --interactive'
compdef _git gri=git-rebase
alias gfr='git pull --rebase'
compdef _git gfr=git-pull
alias gss='git stash save'
compdef _git gss=git-stash
alias gsp='git stash pop'
compdef _git gsp=git-stash

alias gba="git branch -a -v --color"

alias git-update-deleted="git ls-files -z --deleted | git update-index -z --remove --stdin"
alias gud=git-update-deleted

# aliases
# alias hub=git wtf?
alias ....='cd ../../../'
alias diff='diff -U 3'

# rails
alias mig='rake db:migrate'
alias migt='RAILS_ENV=test rake db:migrate'

alias r='./script/rails'
alias rc='r c'
alias rgm='r g migration'
alias be='bundle exec'

# no fuckin correct
# unsetopt correct_all
alias rspec='nocorrect rspec'

# alt + delete
bindkey "^[(" backward-kill-word

# alt + left/right
bindkey "^[[1;9C" forward-word
bindkey "^[[1;9D" backward-word
