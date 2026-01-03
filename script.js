document.addEventListener('DOMContentLoaded', () => {
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const links = document.querySelectorAll('.nav-links li');

    // Toggle Mobile Menu
    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        
        // Hamburger Animation
        hamburger.classList.toggle('toggle');
    });

    // Close Mobile Menu when clicking a link
    links.forEach(link => {
        link.addEventListener('click', () => {
            if (navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
                hamburger.classList.remove('toggle');
            }
        });
    });

    // Theme Toggle
    const themeBtn = document.getElementById('theme-toggle');
    const icon = themeBtn.querySelector('i');
    
    // Check for saved theme
    if (localStorage.getItem('theme') === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
        icon.classList.remove('fa-moon');
        icon.classList.add('fa-sun');
    }

    themeBtn.addEventListener('click', () => {
        if (document.documentElement.getAttribute('data-theme') === 'dark') {
            document.documentElement.removeAttribute('data-theme');
            localStorage.setItem('theme', 'light');
            icon.classList.remove('fa-sun');
            icon.classList.add('fa-moon');
        } else {
            document.documentElement.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
            icon.classList.remove('fa-moon');
            icon.classList.add('fa-sun');
        }
    });

    // Typing Effect
    const textElement = document.querySelector('.typing-text');
    const phrases = ['Web Development', 'Workflow Automation', 'Cloud Solutions', 'Digital Transformation'];
    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typeSpeed = 100;

    function type() {
        const currentPhrase = phrases[phraseIndex];
        
        if (isDeleting) {
            textElement.textContent = currentPhrase.substring(0, charIndex - 1);
            charIndex--;
            typeSpeed = 50;
        } else {
            textElement.textContent = currentPhrase.substring(0, charIndex + 1);
            charIndex++;
            typeSpeed = 150;
        }

        if (!isDeleting && charIndex === currentPhrase.length) {
            isDeleting = true;
            typeSpeed = 2000; // Pause at end
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            phraseIndex = (phraseIndex + 1) % phrases.length;
            typeSpeed = 500; // Pause before new phrase
        }

        setTimeout(type, typeSpeed);
    }
    
    // Start typing effect
    if (textElement) {
        setTimeout(type, 1000);
    }

    // Project Filtering
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all buttons
            filterBtns.forEach(b => b.classList.remove('active'));
            // Add active class to clicked button
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            projectCards.forEach(card => {
                if (filterValue === 'all' || card.getAttribute('data-category') === filterValue) {
                    card.classList.remove('hide');
                    card.classList.add('show');
                } else {
                    card.classList.add('hide');
                    card.classList.remove('show');
                }
            });
        });
    });

    // Scroll Animations
    const revealElements = document.querySelectorAll('.project-card, .about-content, .contact-form');
    
    // Add reveal class to elements
    revealElements.forEach(el => el.classList.add('reveal'));

    const revealOnScroll = () => {
        const windowHeight = window.innerHeight;
        const elementVisible = 150;

        revealElements.forEach(el => {
            const elementTop = el.getBoundingClientRect().top;
            if (elementTop < windowHeight - elementVisible) {
                el.classList.add('active');
            }
        });
    };

    window.addEventListener('scroll', revealOnScroll);
    // Trigger once on load
    revealOnScroll();

    // --- Interactive Terminal Logic ---
    const terminalInput = document.getElementById('terminal-input');
    const terminalContent = document.getElementById('terminal-content');
    const terminalBody = document.getElementById('terminal-body');

    // Virtual File System
    const fileSystem = {
        '~': {
            type: 'dir',
            contents: {
                'services': {
                    type: 'dir',
                    contents: {
                        'web_dev.txt': { type: 'file', content: 'High-performance websites and web applications built with modern stacks (React, Node, Python).' },
                        'automation.txt': { type: 'file', content: 'Streamline your business processes with custom scripts and workflow automation tools.' },
                        'consulting.txt': { type: 'file', content: 'Expert advice on digital transformation and tech strategy.' }
                    }
                },
                'about': {
                    type: 'dir',
                    contents: {
                        'mission.txt': { type: 'file', content: 'Vester empowers businesses to thrive in the digital age through innovation and efficiency.' },
                        'team.txt': { type: 'file', content: 'A collective of senior developers, architects, and automation experts.' }
                    }
                },
                'contact': {
                    type: 'dir',
                    contents: {
                        'email.txt': { type: 'file', content: '016sylveter@gmail.com' },
                        'socials.txt': { type: 'file', content: 'LinkedIn: /company/vester | Twitter: @vester_tech' }
                    }
                },
                'README.md': { type: 'file', content: 'Welcome to Vester Terminal! Navigate using cd, ls, and cat to explore our services.' }
            }
        }
    };

    let currentPath = ['~'];

    // Helper to get current directory object
    function getCurrentDir() {
        let current = fileSystem['~'];
        for (let i = 1; i < currentPath.length; i++) {
            current = current.contents[currentPath[i]];
        }
        return current;
    }

    if (terminalInput) {
        // Focus input when clicking anywhere in terminal body
        terminalBody.addEventListener('click', () => {
            terminalInput.focus();
        });

        terminalInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                const command = terminalInput.value.trim();
                const pathString = currentPath.join('/').replace('~', '~'); // Pretty print path
                const prompt = `guest@vester:${pathString}$ `;
                
                // Add command to history (display it)
                addToTerminal(`${prompt}${command}`, 'cmd-line', prompt);
                
                // Process command
                processCommand(command);
                
                // Clear input and update prompt in input line
                terminalInput.value = '';
                document.querySelector('.terminal-input-line .prompt').textContent = `guest@vester:${currentPath.join('/')}$ `;
                
                // Scroll to bottom
                terminalBody.scrollTop = terminalBody.scrollHeight;
            }
        });
    }

    function addToTerminal(text, type = 'output', promptText = '') {
        const div = document.createElement('div');
        div.className = 'terminal-line';
        
        if (type === 'cmd-line') {
            const promptSpan = document.createElement('span');
            promptSpan.className = 'prompt';
            promptSpan.textContent = promptText || 'guest@vester:~$ ';
            
            const cmdSpan = document.createElement('span');
            cmdSpan.className = 'cmd';
            cmdSpan.textContent = text.replace(promptText || 'guest@vester:~$ ', '');
            
            div.appendChild(promptSpan);
            div.appendChild(cmdSpan);
        } else {
            const outputSpan = document.createElement('span');
            outputSpan.className = 'output';
            outputSpan.innerHTML = text; // Allow HTML for links etc
            div.appendChild(outputSpan);
        }
        
        terminalContent.appendChild(div);
    }

    function processCommand(cmd) {
        const args = cmd.trim().split(/\s+/);
        const mainCmd = args[0].toLowerCase();
        const arg1 = args[1];
        
        switch (mainCmd) {
            case 'help':
                addToTerminal('Available commands:');
                addToTerminal('- <span class="highlight">ls</span>: List directory contents');
                addToTerminal('- <span class="highlight">cd [dir]</span>: Change directory');
                addToTerminal('- <span class="highlight">pwd</span>: Print working directory');
                addToTerminal('- <span class="highlight">cat [file]</span>: Read file content');
                addToTerminal('- <span class="highlight">about</span>: Learn more about us');
                addToTerminal('- <span class="highlight">services</span>: View our services');
                addToTerminal('- <span class="highlight">contact</span>: Get contact info');
                addToTerminal('- <span class="highlight">clear</span>: Clear the terminal');
                addToTerminal('- <span class="highlight">theme</span>: Toggle dark/light mode');
                break;

            case 'ls':
                const dir = getCurrentDir();
                const items = Object.keys(dir.contents).map(item => {
                    const isDir = dir.contents[item].type === 'dir';
                    return isDir ? `<span style="color: #50fa7b">${item}/</span>` : item;
                });
                addToTerminal(items.join('  '));
                break;

            case 'pwd':
                addToTerminal(currentPath.join('/'));
                break;

            case 'cd':
                if (!arg1 || arg1 === '~') {
                    currentPath = ['~'];
                } else if (arg1 === '..') {
                    if (currentPath.length > 1) {
                        currentPath.pop();
                    }
                } else if (arg1 === '.') {
                    // Do nothing
                } else {
                    const currentDir = getCurrentDir();
                    // Handle trailing slash
                    const targetDirName = arg1.endsWith('/') ? arg1.slice(0, -1) : arg1;
                    
                    if (currentDir.contents[targetDirName] && currentDir.contents[targetDirName].type === 'dir') {
                        currentPath.push(targetDirName);
                    } else if (currentDir.contents[targetDirName] && currentDir.contents[targetDirName].type === 'file') {
                        addToTerminal(`bash: cd: ${arg1}: Not a directory`);
                    } else {
                        addToTerminal(`bash: cd: ${arg1}: No such file or directory`);
                    }
                }
                break;

            case 'cat':
                if (!arg1) {
                    addToTerminal('Usage: cat [filename]');
                } else {
                    const currentDir = getCurrentDir();
                    const targetFile = currentDir.contents[arg1];
                    if (targetFile && targetFile.type === 'file') {
                        addToTerminal(targetFile.content);
                    } else if (targetFile && targetFile.type === 'dir') {
                        addToTerminal(`cat: ${arg1}: Is a directory`);
                    } else {
                        addToTerminal(`cat: ${arg1}: No such file or directory`);
                    }
                }
                break;
                
            case 'mkdir':
                addToTerminal(`mkdir: cannot create directory '${arg1 || ''}': Permission denied (Read-only file system)`);
                break;
                
            case 'sudo':
                addToTerminal('guest is not in the sudoers file. This incident will be reported.');
                break;

            case 'rm':
                addToTerminal('rm: cannot remove \'' + (arg1 || '') + '\': Permission denied');
                break;
                
            case 'about':
                addToTerminal('Vester is a forward-thinking technology partner dedicated to transforming businesses through digital innovation.');
                document.querySelector('#about').scrollIntoView({ behavior: 'smooth' });
                break;
                
            case 'services':
                addToTerminal('Checking services database...');
                addToTerminal('1. Web Development');
                addToTerminal('2. Process Automation');
                addToTerminal('3. System Integration');
                addToTerminal('4. Tech Consulting');
                document.querySelector('#projects').scrollIntoView({ behavior: 'smooth' });
                break;
                
            case 'contact':
                addToTerminal('Email: hello@vester.tech');
                addToTerminal('Twitter: @vester_tech');
                document.querySelector('#contact').scrollIntoView({ behavior: 'smooth' });
                break;
                
            case 'clear':
                terminalContent.innerHTML = '';
                break;
            
            case 'theme':
                themeBtn.click(); 
                addToTerminal('Theme toggled.');
                break;

            case '':
                break;
                
            default:
                if (mainCmd.startsWith('echo')) {
                    addToTerminal(cmd.substring(5));
                } else {
                    addToTerminal(`Command not found: ${mainCmd}. Type 'help' for available commands.`);
                }
        }
    }

    // Smooth Scrolling for Anchor Links (Optional as CSS scroll-behavior: smooth handles most)
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                // Account for fixed header height
                const headerOffset = 60;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: "smooth"
                });
            }
        });
    });
});
