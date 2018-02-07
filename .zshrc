# Path to your oh-my-zsh configuration.
ZSH=$HOME/.oh-my-zsh

# Set name of the theme to load.
# Look in ~/.oh-my-zsh/themes/
# Optionally, if you set this to "random", it'll load a random theme each
# time that oh-my-zsh is loaded.
ZSH_THEME="sammy"

# Example aliases
# alias zshconfig="mate ~/.zshrc"
# alias ohmyzsh="mate ~/.oh-my-zsh"

# Set to this to use case-sensitive completion
# CASE_SENSITIVE="true"

# Uncomment this to disable bi-weekly auto-update checks
DISABLE_AUTO_UPDATE="true"

# Uncomment to change how often before auto-updates occur? (in days)
# export UPDATE_ZSH_DAYS=13

# Uncomment following line if you want to disable colors in ls
# DISABLE_LS_COLORS="true"

# Uncomment following line if you want to disable autosetting terminal title.
# DISABLE_AUTO_TITLE="true"

# Uncomment following line if you want to disable command autocorrection
DISABLE_CORRECTION="true"

# Uncomment following line if you want red dots to be displayed while waiting for completion
# COMPLETION_WAITING_DOTS="true"

# Uncomment following line if you want to disable marking untracked files under
# VCS as dirty. This makes repository status check for large repositories much,
# much faster.
# DISABLE_UNTRACKED_FILES_DIRTY="true"

# Which plugins would you like to load? (plugins can be found in ~/.oh-my-zsh/plugins/*)
# Custom plugins may be added to ~/.oh-my-zsh/custom/plugins/
# Example format: plugins=(rails git textmate ruby lighthouse)
plugins=(git history-substring-search) # ssh-agent
# zstyle :omz:plugins:ssh-agent identities id_rsa

# export HOMEBREW_CASK_OPTS="--appdir=~/Applications"

source $ZSH/oh-my-zsh.sh
source /usr/local/opt/chruby/share/chruby/chruby.sh
source /usr/local/opt/chruby/share/chruby/auto.sh

# Customize to your needs...
export PATH=~/bin/chelu:~/bin:/usr/local/git/bin:/usr/local/bin:/usr/local/sbin:/usr/bin:/bin:/usr/sbin:/sbin:/usr/local/bin:$PATH

export LANG=en_US.UTF-8
export LC_ALL=en_US.UTF-8
export LC_CTYPE=en_US.UTF-8

export SAUHOME=~/Work/sauspiel

#export PATH=$HOME/.rbenv/bin:$PATH
#eval "$(rbenv init - zsh)"
#export FORCE_SAUSPIEL_APPS_TZ=Lisbon

# openssl from homebrew
export LDFLAGS="-L/usr/local/opt/openssl/lib"
export CPPFLAGS="-I/usr/local/opt/openssl/include"
export PATH="/usr/local/opt/openssl/bin:$PATH"

# export PATH="$HOME/.erlenv/bin:$PATH"
# eval "$(erlenv init -)"
# export PATH="$HOME/.exenv/bin:$PATH"
# eval "$(exenv init -)"
 export NVM_DIR="$HOME/.nvm"
  . "/usr/local/opt/nvm/nvm.sh"

export BOOT_JVM_OPTIONS="-client -Xmx2g -XX:+TieredCompilation -XX:TieredStopAtLevel=1 -Xverify:none"
export JOURNAL_HOME="/Users/cristi/work/nextjournal/nextjournal/apps/journal"

# eval $(thefuck --alias --enable-experimental-instant-mode)
eval $(thefuck --alias)

