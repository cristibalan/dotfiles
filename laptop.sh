cd

# zsh
sh -c "$(curl -fsSL https://raw.github.com/robbyrussell/oh-my-zsh/master/tools/install.sh)"

# lock .oh-my-zsh to a version compatible with my custom plugin
cd .oh-my-zsh
git fetch --unshallow
git checkout bf7b916
cd ..

# dotfiles
rm .zshrc
rm .zshrc-e

git clone https://github.com/cristibalan/dotfiles.git
./dotfiles/dot --all --run

ln -s ~/dotfiles/.oh-my-zsh/custom/chelu.zsh ~/.oh-my-zsh/custom/chelu.zsh

# ./dotfiles/.osx

git clone https://github.com/cristibalan/vimfiles.git

# .vim
mv ~/.vim ~/.vim.old
mv ~/.vimrc ~/.vimrc-old
mv ~/.gvimrc ~/.gvimrc-old

ln -s ~/.vim/vimrc.vim  ~/.vimrc
ln -s ~/.vim/gvimrc.vim ~/.gvimrc

git clone https://github.com/cristibalan/.spacemacs.d.git

# homebrew
ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"

brew install mas
brew tap Homebrew/bundle
# for java8
brew tap caskroom/versions

# iterm
brew cask install iterm
defaults write com.googlecode.iterm2.plist PrefsCustomFolder -string "~/dotfiles/Library/iterm2"
defaults write com.googlecode.iterm2.plist LoadPrefsFromCustomFolder -bool true

# macvim
brew install ruby
brew cask install macvim

# ruby
ruby-install ruby 2.4.1
gem install bundler

# brew bundle -v 2>&1 | tee ~/brew-bundle.log

# brew services start postgresql
# brew services start mysql
