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

./dotfiles/.osx

# .vim
mv ~/.vim ~/.vim.old
mv ~/.vimrc ~/.vimrc-old
mv ~/.gvimrc ~/.gvimrc-old

ln -s ~/.vim/vimrc.vim  ~/.vimrc
ln -s ~/.vim/gvimrc.vim ~/.gvimrc

# homebrew
ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"

brew install openssl
brew unlink openssl && brew link openssl --force

brew tap Homebrew/bundle
brew bundle -v 2>&1 | tee ~/laptop.log

brew unlink openssl && brew link openssl --force

ruby-install ruby 2.2.2
gem install bundler

brew services start postgresql
brew services start mysql

# pow
brew install pow

# Create the required host directories:
mkdir -p ~/Library/Application\ Support/Pow/Hosts
ln -s ~/Library/Application\ Support/Pow/Hosts ~/.pow

# Setup port 80 forwarding and launchd agents:
sudo pow --install-system
pow --install-local

# Load launchd agents:
sudo launchctl load -w /Library/LaunchDaemons/cx.pow.firewall.plist
launchctl load -w ~/Library/LaunchAgents/cx.pow.powd.plist

gem install powder

# Show the 'Developer' checkbox in spotlight preferences
touch /Applications/Xcode.app

