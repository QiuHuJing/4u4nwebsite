//原有逻辑
document.addEventListener('DOMContentLoaded', function() {
    const backToTopButton = document.getElementById('backToTop');

    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            backToTopButton.style.opacity = '1';
        } else {
            backToTopButton.style.opacity = '0';
        }
    });

    backToTopButton.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
});

// 玩家查询功能
document.addEventListener('DOMContentLoaded', () => {
  const queryBtn = document.getElementById('query-btn');
  const playerInput = document.getElementById('player-name');
  const loading = document.getElementById('loading');
  const notFound = document.getElementById('not-found');
  const result = document.getElementById('result');
  const resultName = document.getElementById('result-name');
  const inventory = document.getElementById('inventory');
  const papiVars = document.getElementById('papi-vars');

  // 点击查询按钮或按回车触发
  queryBtn.addEventListener('click', fetchPlayerInfo);
  playerInput.addEventListener('keyup', (e) => {
    if (e.key === 'Enter') fetchPlayerInfo();
  });

  // 调用后端API查询玩家信息
  function fetchPlayerInfo() {
    const playerName = playerInput.value.trim();
    if (!playerName) {
      alert('请输入玩家名称');
      return;
    }

    // 显示加载状态
    loading.classList.remove('hidden');
    notFound.classList.add('hidden');
    result.classList.add('hidden');

    // 调用Vercel后端API（替换为你的Vercel域名）
    fetch(`https://mc-server-api.vercel.app/api/player-info?name=${encodeURIComponent(playerName)}`)
      .then(res => res.json())
      .then(data => {
        loading.classList.add('hidden');
        if (data.exists) {
          // 显示查询结果
          result.classList.remove('hidden');
          resultName.textContent = data.name;
          renderInventory(data.inventory);
          renderPapiVars(data.papiVariables);
        } else {
          // 玩家不存在
          notFound.classList.remove('hidden');
        }
      })
      .catch(error => {
        console.error('查询失败:', error);
        loading.classList.add('hidden');
        alert('查询失败，请稍后重试');
      });
  }

  // 渲染背包物品
  function renderInventory(items) {
    inventory.innerHTML = '';
    if (items.length === 0) {
      inventory.innerHTML = '<p class="col-span-9 text-center text-gray-500">背包为空</p>';
      return;
    }
    items.forEach(item => {
      const itemEl = document.createElement('div');
      itemEl.className = 'bg-white rounded p-1 border text-center';
      itemEl.innerHTML = `
        <img src="${item.icon}" alt="${item.name}" class="w-8 h-8 mx-auto">
        <span class="text-xs">${item.amount > 1 ? item.amount : ''}</span>
      `;
      itemEl.title = `${item.name} x${item.amount}`;
      inventory.appendChild(itemEl);
    });
  }

  // 渲染PAPI变量
  function renderPapiVars(vars) {
    papiVars.innerHTML = '';
    for (const [key, value] of Object.entries(vars)) {
      const varEl = document.createElement('div');
      varEl.className = 'bg-white p-2 rounded border';
      varEl.innerHTML = `<span class="font-medium">${key}:</span> <span>${value}</span>`;
      papiVars.appendChild(varEl);
    }
  }
});

// 页面完全加载后隐藏加载动画并显示内容
window.addEventListener('load', function() {
    setTimeout(function() {
        document.getElementById('preloader').style.opacity = '0';
        setTimeout(function() {
            document.getElementById('preloader').style.display = 'none';
            document.getElementById('content').style.display = 'block';
        }, 500);
    }, 500); // 这里可以调整动画显示的最短时间
});

// 显示帮助弹窗
function showHelpModal() {
    document.getElementById('help-modal').classList.remove('opacity-0', 'invisible');
    document.getElementById('help-modal').classList.add('opacity-100', 'visible');
    document.body.style.overflow = 'hidden'; // 防止背景滚动
}

// 隐藏帮助弹窗
function hideHelpModal() {
    document.getElementById('help-modal').classList.remove('opacity-100', 'visible');
    document.getElementById('help-modal').classList.add('opacity-0', 'invisible');
    document.body.style.overflow = ''; // 恢复滚动
}

// 复制指令功能
document.addEventListener('DOMContentLoaded', function() {
    // 给所有指令添加点击复制事件
    document.querySelectorAll('.copy-command').forEach(el => {
        el.addEventListener('click', function() {
            // 提取指令部分（只复制/开头的指令，不含后面的说明）
            const command = this.textContent.split(' ')[0];
            navigator.clipboard.writeText(command).then(() => {
                showToast();
            }).catch(err => {
                console.error('复制失败:', err);
                // 降级处理
                const textArea = document.createElement('textarea');
                textArea.value = command;
                document.body.appendChild(textArea);
                textArea.select();
                document.execCommand('copy');
                document.body.removeChild(textArea);
                showToast();
            });
        });
    });

    // 点击弹窗背景关闭
    document.getElementById('help-modal').addEventListener('click', function(e) {
        if (e.target === this) {
            hideHelpModal();
        }
    });
});

// 显示提示框
function showToast() {
    const toast = document.getElementById('command-toast');
    toast.style.opacity = '1';

    // 2秒后自动隐藏
    setTimeout(() => {
        toast.style.opacity = '0';
    }, 1000);
}

// 显示公告弹窗（自动/手动调用通用）
function showAnnouncementModal() {
    const modal = document.getElementById('announcement-modal');
    // 确保弹窗处于隐藏状态时才执行显示
    if (modal.classList.contains('opacity-0') || modal.classList.contains('invisible')) {
        modal.classList.remove('opacity-0', 'invisible', 'scale-95');
        modal.classList.add('opacity-100', 'visible', 'scale-100');
        document.body.style.overflow = 'hidden'; // 禁止背景滚动
    }
}

// 关闭公告弹窗
function hideAnnouncementModal() {
    const modal = document.getElementById('announcement-modal');
    modal.classList.remove('opacity-100', 'visible', 'scale-100');
    modal.classList.add('opacity-0', 'invisible', 'scale-95');
    document.body.style.overflow = ''; // 恢复滚动
}

document.addEventListener('DOMContentLoaded', function() {
    const modal = document.getElementById('announcement-modal');
    const closeBtn = document.getElementById('close-announcement');
    const hasShown = localStorage.getItem('announcementShown');

    // 自动弹出逻辑（首次加载触发）
    if (!hasShown) {
        setTimeout(() => {
            showAnnouncementModal();
            // 标记为已显示（保存30天）
            const expiryDate = new Date();
            expiryDate.setTime(expiryDate.getTime() + (30 * 24 * 60 * 60 * 1000));
            localStorage.setItem('announcementShown', 'true');
        }, 1000);
    }

    // 手动关闭逻辑
    closeBtn.addEventListener('click', hideAnnouncementModal);

    // 点击背景关闭
    modal.addEventListener('click', function(e) {
        if (e.target === this) {
            hideAnnouncementModal();
        }
    });
});

document.addEventListener('DOMContentLoaded', function() {
    const playerCount = document.getElementById('player-count');
    const playerList = document.getElementById('player-list');
    const playersList = document.getElementById('players-list');
    const playerInfoModal = document.getElementById('player-info-modal');
    let hideTimer = null;

    // 悬浮列表显示/隐藏逻辑
    playerCount.addEventListener('mouseenter', function() {
        if (hideTimer) clearTimeout(hideTimer);
        playerList.classList.remove('opacity-0', 'invisible');
        playerList.classList.add('opacity-100', 'visible');
    });
    playerCount.addEventListener('mouseleave', function() {
        hideTimer = setTimeout(() => {
            playerList.classList.remove('opacity-100', 'visible');
            playerList.classList.add('opacity-0', 'invisible');
        }, 1500);
    });

    // 关闭信息弹窗
    document.getElementById('close-modal').addEventListener('click', function() {
        playerInfoModal.classList.remove('opacity-100', 'visible', 'scale-100');
        playerInfoModal.classList.add('opacity-0', 'invisible', 'scale-95');
    });

    // ✅ 关键：点击玩家名事件委托
    playersList.addEventListener('click', function(e) {
        if (e.target.tagName === 'SPAN' && e.target.dataset.player) {
            const playerName = e.target.dataset.player;
            showPlayerInfo(playerName);
        }
    });

    // ✅ 使用国内镜像获取玩家信息
    async function showPlayerInfo(playerName) {
        document.getElementById('modal-player-name').textContent = `${playerName}`;
        document.getElementById('player-avatars').src = 'https://devtool.tech/api/placeholder/80/80?text=S&color=%23000099&bgColor=%2366b2ff&fontFamily=SimSun';
        document.getElementById('player-uuids').textContent = '加载中...';
        document.getElementById('player-display-name').textContent = playerName;

        playerInfoModal.classList.remove('opacity-0', 'invisible', 'scale-95');
        playerInfoModal.classList.add('opacity-100', 'visible', 'scale-100');

        try {
            // 国内镜像获取UUID
            const uuidResp = await fetch(`https://crafatar.com/avatars/${playerName}`);
            if (!uuidResp.ok) throw new Error('玩家不存在');
            const uuidData = await uuidResp.json();
            const uuid = uuidData.id;

            // 国内镜像获取头像
            const avatarUrl = `https://crafatar.com/avatars/${playerName}`;

            document.getElementById('player-avatars').src = avatarUrl;
            document.getElementById('player-uuids').textContent = uuid;
            document.getElementById('modal-player-name').textContent = `玩家信息: ${playerName}`;

            // 模拟数据
            document.getElementById('player-join-date').textContent = '2023-01-15';
            document.getElementById('player-last-seen').textContent = '刚刚';

        } catch (error) {
            console.error('获取玩家信息失败:', error);
            document.getElementById('player-avatars').src = 'https://devtool.tech/api/placeholder/80/80?text=S&color=%23000099&bgColor=%2366b2ff&fontFamily=SimSun';
            document.getElementById('player-uuids').textContent = '无法获取';
        }
    }

    // 更新玩家列表
    function updatePlayerList(players) {
        playersList.innerHTML = '';
        if (!players || players.length === 0) {
            playersList.innerHTML = '<span class="block text-gray-400 py-1 px-1">当前没有玩家在线</span>';
            return;
        }
        players.forEach(player => {
            const item = document.createElement('span');
            item.textContent = player;
            item.className = 'block py-1 hover:bg-gray-700 px-1 rounded transition-colors cursor-pointer';
            item.dataset.player = player; // 存储玩家名
            playersList.appendChild(item);
        });
    }

    // 获取服务器状态
    async function fetchServerStatus() {
        try {
            const response = await fetch(`https://api.mcsrvstat.us/2/4u4n.qiunaruto.top`, { cache: 'no-store' });
            const data = await response.json();
            updatePlayerList(data.online ? data.players?.list || [] : []);
            document.getElementById('player-count').firstChild.textContent = data.online ? data.players.online : '0';
            document.getElementById('max-players').textContent = data.players?.max || '--';
            document.getElementById('server-status').textContent = data.online ? '在线' : '离线';
            document.getElementById('server-status').className = data.online
                ? 'ml-2 px-2 py-0.5 text-xs rounded-full bg-green-500'
                : 'ml-2 px-2 py-0.5 text-xs rounded-full bg-red-500';
            document.getElementById('last-update').textContent = `(最后更新: ${new Date().toLocaleTimeString()})`;
        } catch (error) {
            console.error("获取服务器状态失败:", error);
            playersList.innerHTML = '<span class="block text-gray-400 py-1 px-1">无法获取玩家列表</span>';
        }
    }

    fetchServerStatus();
    setInterval(fetchServerStatus, 15000);
});

// 轮播功能实现
document.addEventListener('DOMContentLoaded', function() {
    const slides = document.querySelectorAll('.carousel-slide');
    const indicators = document.querySelectorAll('.carousel-indicator');
    let currentIndex = 0;
    const slideInterval = 5000; // 5秒切换一次

    // 切换到指定幻灯片
    function showSlide(index) {
        // 隐藏所有幻灯片
        slides.forEach(slide => {
            slide.classList.remove('opacity-100');
            slide.classList.add('opacity-0');
        });

        // 重置所有指示器
        indicators.forEach(indicator => {
            indicator.classList.remove('opacity-100');
            indicator.classList.add('opacity-50');
        });

        // 显示当前幻灯片和激活当前指示器
        slides[index].classList.remove('opacity-0');
        slides[index].classList.add('opacity-100');
        indicators[index].classList.remove('opacity-50');
        indicators[index].classList.add('opacity-100');

        currentIndex = index;
    }

    // 下一张幻灯片
    function nextSlide() {
        let newIndex = (currentIndex + 1) % slides.length;
        showSlide(newIndex);
    }

    // 设置自动轮播
    let interval = setInterval(nextSlide, slideInterval);

    // 点击指示器切换幻灯片
    indicators.forEach(indicator => {
        indicator.addEventListener('click', function() {
            // 清除自动轮播计时器
            clearInterval(interval);
            // 切换到对应的幻灯片
            showSlide(parseInt(this.dataset.index));
            // 重新设置自动轮播
            interval = setInterval(nextSlide, slideInterval);
        });
    });
});

// 处理IP地址复制功能
document.addEventListener('DOMContentLoaded', function() {
const ipText = document.getElementById('ip-text');
const copyBtn = document.getElementById('copy-ip');
const ipTextSecondary = document.getElementById('ip-text-secondary');
const copyBtnSecondary = document.getElementById('copy-ip-secondary');
const copyModal = document.getElementById('copy-success-modal');
const closeCopyModal = document.getElementById('close-copy-modal');

// 复制主IP地址到剪贴板
copyBtn.addEventListener('click', function() {
copyToClipboard(ipText.textContent, "主线地址已复制到剪贴板");
});

// 复制副IP地址到剪贴板
copyBtnSecondary.addEventListener('click', function() {
copyToClipboard(ipTextSecondary.textContent, "副线地址已复制到剪贴板");
});

// 种子复制功能
document.getElementById('copy-seed').addEventListener('click', () => {
    const seedText = document.getElementById('seed-text').textContent;
    copyToClipboard(seedText, '种子复制成功');
});

// 关闭弹窗
closeCopyModal.addEventListener('click', function() {
copyModal.classList.remove('opacity-100', 'visible', 'scale-100');
copyModal.classList.add('opacity-0', 'invisible', 'scale-95');
});

// 通用复制函数
function copyToClipboard(text, message) {
navigator.clipboard.writeText(text).then(() => {
// 更新弹窗消息
document.querySelector('#copy-success-modal p').textContent = message;
// 显示成功弹窗
copyModal.classList.remove('opacity-0', 'invisible', 'scale-95');
copyModal.classList.add('opacity-100', 'visible', 'scale-100');

// 3秒后自动关闭弹窗
setTimeout(() => {
closeCopyModal.click();
}, 3000);
}).catch(err => {
console.error('复制失败:', err);
// 降级处理
const textArea = document.createElement('textarea');
textArea.value = text;
document.body.appendChild(textArea);
textArea.select();
document.execCommand('copy');
document.body.removeChild(textArea);

// 显示成功弹窗
document.querySelector('#copy-success-modal p').textContent = message;
copyModal.classList.remove('opacity-0', 'invisible', 'scale-95');
copyModal.classList.add('opacity-100', 'visible', 'scale-100');

setTimeout(() => {
closeCopyModal.click();
}, 3000);
});
}
});

document.addEventListener('DOMContentLoaded', function() {
    // 元素获取（新增下一首按钮）
    const audio = document.getElementById('bg-music');
    const playBtn = document.getElementById('music-play-btn');
    const nextBtn = document.getElementById('music-next-btn'); // 新增下一首按钮
    const musicIcon = document.getElementById('music-icon');
    const volumeSlider = document.getElementById('music-volume');
    const musicName = document.getElementById('music-name');
    const musicTipModal = document.getElementById('music-tip-modal');
    const closeMusicTip = document.getElementById('close-music-tip');
    const confirmMusicTip = document.getElementById('confirm-music-tip');

    // 关键：获取所有音乐源（含名称），用于切换和显示
    const musicSources = Array.from(audio.children).filter(el => el.tagName === 'SOURCE');
    let currentSourceIndex = 0; // 当前播放的音乐索引


    // 1. 播放/暂停切换（原有逻辑不变）
    playBtn.addEventListener('click', function() {
        if (audio.paused) {
            audio.play().catch(err => {
                musicTipModal.classList.remove('opacity-0', 'invisible', 'scale-95');
                musicTipModal.classList.add('opacity-100', 'visible', 'scale-100');
            });
            musicIcon.classList.replace('fa-play', 'fa-pause');
        } else {
            audio.pause();
            musicIcon.classList.replace('fa-pause', 'fa-play');
        }
    });


    // 2. 新增：手动切换下一首
    nextBtn.addEventListener('click', function() {
        // 计算下一首的索引（循环切换：最后一首切回第一首）
        currentSourceIndex = (currentSourceIndex + 1) % musicSources.length;
        // 切换到下一首音乐
        const nextSource = musicSources[currentSourceIndex];
        audio.src = nextSource.src;
        // 显示下一首的名称（从 source 标签的 data-name 属性获取）
        musicName.textContent = nextSource.dataset.name || '歌曲';
        // 如果当前是播放状态，切换后自动继续播放
        if (!audio.paused) {
            audio.play().catch(err => {
                // 若切换时触发播放限制，仅提示，不中断切换
                musicTipModal.classList.remove('opacity-0', 'invisible', 'scale-95');
                musicTipModal.classList.add('opacity-100', 'visible', 'scale-100');
            });
        }
    });


    // 3. 关闭音乐提示窗（原有逻辑不变）
    [closeMusicTip, confirmMusicTip].forEach(btn => {
        btn.addEventListener('click', function() {
            musicTipModal.classList.remove('opacity-100', 'visible', 'scale-100');
            musicTipModal.classList.add('opacity-0', 'invisible', 'scale-95');
        });
    });


    // 4. 点击页面解锁播放权限（原有逻辑不变）
    document.addEventListener('click', function(e) {
        const isMusicControl = e.target.closest('.music-control');
        const isMusicTip = e.target.closest('#music-tip-modal');
        if (!isMusicControl && !isMusicTip) {
            if (localStorage.getItem('bgMusicPlaying') === 'true') {
                musicIcon.classList.replace('fa-play', 'fa-pause');
            }
        }
    }, { once: true });


    // 5. 音量调节（原有逻辑不变）
    volumeSlider.addEventListener('input', function() {
        audio.volume = this.value;
        if (this.value == 0) {
            musicIcon.classList.replace('fa-pause', 'fa-volume-mute');
            musicIcon.classList.replace('fa-play', 'fa-volume-mute');
        } else if (audio.paused) {
            musicIcon.classList.replace('fa-volume-mute', 'fa-play');
        } else {
            musicIcon.classList.replace('fa-volume-mute', 'fa-pause');
        }
    });


    // 6. 音乐自动播放下一首（原有逻辑不变，与手动切换同步）
    audio.addEventListener('ended', function() {
        nextBtn.click(); // 歌曲结束时，自动触发「下一首」按钮的点击事件
    });


    // 7. 页面刷新/切换时保留状态（原有逻辑不变）
    window.addEventListener('load', function() {
        const savedVolume = localStorage.getItem('bgMusicVolume');
        const wasPlaying = localStorage.getItem('bgMusicPlaying') === 'true';
        const savedIndex = localStorage.getItem('bgMusicIndex');

        // 恢复音量
        if (savedVolume) {
            audio.volume = savedVolume;
            volumeSlider.value = savedVolume;
        }

        // 恢复播放索引和名称
        if (savedIndex && !isNaN(Number(savedIndex))) {
            currentSourceIndex = Number(savedIndex);
            const savedSource = musicSources[currentSourceIndex];
            audio.src = savedSource.src;
            musicName.textContent = savedSource.dataset.name || '歌曲';
        }

        // 恢复播放状态图标
        if (wasPlaying) {
            musicIcon.classList.replace('fa-play', 'fa-pause');
        }
    });

    // 页面关闭前保存状态（新增保存当前播放索引）
    window.addEventListener('beforeunload', function() {
        localStorage.setItem('bgMusicVolume', audio.volume);
        localStorage.setItem('bgMusicPlaying', !audio.paused);
        localStorage.setItem('bgMusicIndex', currentSourceIndex); // 保存当前播放的音乐索引
    });
});
tailwind.config = { theme: { extend: { colors: { primary: '#007AFF', secondary: '#5856D6' }, borderRadius: { 'none': '0px', 'sm': '2px', DEFAULT: '4px', 'md': '8px', 'lg': '12px', 'xl': '16px', '2xl': '20px', '3xl': '24px', 'full': '9999px', 'button': '4px' } } } }

// 在script.js中添加移动端菜单交互
document.addEventListener('DOMContentLoaded', function() {
    // 移动端菜单切换
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');

    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', function() {
            mobileMenu.classList.toggle('hidden');
        });

        // 点击菜单项后关闭菜单
        const mobileLinks = mobileMenu.querySelectorAll('a');
        mobileLinks.forEach(link => {
            link.addEventListener('click', function() {
                mobileMenu.classList.add('hidden');
            });
        });
    }

    // 调整轮播图在小屏幕上的切换速度
    function adjustCarouselSpeed() {
        if (window.innerWidth < 768) {
            // 移动端轮播速度减慢
            carouselInterval = setInterval(nextSlide, 6000);
        } else {
            // 桌面端正常速度
            carouselInterval = setInterval(nextSlide, 4000);
        }
    }

    // 初始化时设置一次
    adjustCarouselSpeed();

    // 窗口大小改变时重新设置
    window.addEventListener('resize', adjustCarouselSpeed);
});

// 显示QQ群二维码弹窗
function showQqModal() {
    const modal = document.getElementById('qq-group-modal');
    modal.classList.remove('opacity-0', 'invisible');
    modal.querySelector('div').classList.remove('scale-95');
    modal.querySelector('div').classList.add('scale-100');
    document.body.style.overflow = 'hidden'; // 禁止背景滚动
}

// 关闭QQ群二维码弹窗
document.getElementById('close-qq-modal').addEventListener('click', () => {
    const modal = document.getElementById('qq-group-modal');
    modal.classList.add('opacity-0', 'invisible');
    modal.querySelector('div').classList.remove('scale-100');
    modal.querySelector('div').classList.add('scale-95');
    document.body.style.overflow = ''; // 恢复背景滚动
});

// 点击弹窗外部关闭
document.getElementById('qq-group-modal').addEventListener('click', (e) => {
    if (e.target === document.getElementById('qq-group-modal')) {
        document.getElementById('close-qq-modal').click();
    }
});

// 实用工具弹窗控制
function showUtilityModal() {
    const modal = document.getElementById('utility-modal');
    modal.classList.remove('opacity-0', 'invisible');
    modal.classList.add('opacity-100', 'visible');
    document.body.style.overflow = 'hidden';
}

function hideUtilityModal() {
    const modal = document.getElementById('utility-modal');
    modal.classList.remove('opacity-100', 'visible');
    modal.classList.add('opacity-0', 'invisible');
    document.body.style.overflow = '';
}

// 工具标签页切换
document.querySelectorAll('.utility-tab').forEach(tab => {
    tab.addEventListener('click', () => {
        // 移除所有标签的活跃状态
        document.querySelectorAll('.utility-tab').forEach(t => {
            t.classList.remove('border-primary', 'text-primary');
            t.classList.add('border-transparent', 'text-gray-500');
        });

        // 添加当前标签的活跃状态
        tab.classList.remove('border-transparent', 'text-gray-500');
        tab.classList.add('border-primary', 'text-primary');

        // 隐藏所有内容
        document.querySelectorAll('.utility-content').forEach(content => {
            content.classList.add('hidden');
        });

        // 显示对应内容
        const tabId = tab.getAttribute('data-tab');
        document.getElementById(`${tabId}-content`).classList.remove('hidden');
    });
});

// 生成渐变文字
// 等待DOM加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
    // ===== 元素获取 =====
    const startColorInput = document.getElementById('start-color');
    const endColorInput = document.getElementById('end-color');
    const startColorSwatch = document.getElementById('start-color-swatch');
    const endColorSwatch = document.getElementById('end-color-swatch');
    const textPreview = document.getElementById('text-preview');
    const gradientInput = document.getElementById('gradient-input');
    const generateBtn = document.getElementById('generate-gradient');
    const resultElement = document.getElementById('gradient-result');
    const copyBtn = document.getElementById('copy-gradient');

    // 防错处理：如果关键元素不存在则终止执行
    if (!startColorInput || !endColorInput || !generateBtn || !copyBtn) return;

    // ===== 核心变量（带前缀避免冲突） =====
    let colorSelTarget = 'start'; // 当前选中的颜色目标（start/end）
    const colorSelPreset = [
        '#ff0000','#ff9900','#ffff00','#00ff00','#0099ff','#6633ff',
        '#ff00ff','#ff3399','#993300','#006600','#003366','#330066','#000000','#ffffff'
    ];

    // ===== 1. 单色块选择器 =====
    function initColorPalette() {
        const palette = document.getElementById('color-palette');
        if (!palette) return;

        colorSelPreset.forEach(color => {
            const swatch = document.createElement('div');
            swatch.style.backgroundColor = color;
            swatch.dataset.color = color;

            swatch.addEventListener('click', () => {
                setTargetColor(color);
                highlightSelectedColor(color);
            });

            palette.appendChild(swatch);
        });
    }

    // 高亮选中的单色块
    function highlightSelectedColor(color) {
        const palette = document.getElementById('color-palette');
        if (!palette) return;

        palette.querySelectorAll('div').forEach(swatch => {
            swatch.classList.toggle('selected', swatch.dataset.color.toLowerCase() === color.toLowerCase());
        });
    }

    // ===== 2. 渐变选择器 =====
    function initGradientPicker() {
        const gradient = document.getElementById('color-gradient');
        const indicator = document.getElementById('color-indicator');
        if (!gradient || !indicator) return;

        // 初始化指示器
        indicator.classList.remove('hidden');
        syncIndicatorToColor(startColorInput.value);

        // 点击选择
        gradient.addEventListener('click', (e) => {
            const rect = gradient.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width) * 100;
            const y = ((e.clientY - rect.top) / rect.height) * 100;
            const color = getColorFromPos(x, y);
            setTargetColor(color);
            syncIndicatorToColor(color);
            highlightSelectedColor(color);
        });

        // 拖动选择
        let isDragging = false;
        gradient.addEventListener('mousedown', () => isDragging = true);
        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            const rect = gradient.getBoundingClientRect();
            if (e.clientX < rect.left || e.clientX > rect.right || e.clientY < rect.top || e.clientY > rect.bottom) {
                isDragging = false;
                return;
            }
            const x = ((e.clientX - rect.left) / rect.width) * 100;
            const y = ((e.clientY - rect.top) / rect.height) * 100;
            const color = getColorFromPos(x, y);
            setTargetColor(color);
            syncIndicatorToColor(color);
            highlightSelectedColor(color);
        });
        document.addEventListener('mouseup', () => isDragging = false);
    }

    // 从位置计算颜色（HSL转RGB）
    function getColorFromPos(x, y) {
        const hue = (x / 100) * 360; // 0-360度色相
        const lightness = 50 - (y / 100) * 40; // 10%-50%亮度
        return hslToHex(hue, 100, lightness);
    }

    // HSL转十六进制
    function hslToHex(h, s, l) {
        s /= 100;
        l /= 100;
        let r, g, b;
        if (s === 0) {
            r = g = b = l;
        } else {
            const f = (n) => {
                const k = (n + h / 30) % 12;
                const a = s * Math.min(l, 1 - l);
                return l - a * Math.max(-1, Math.min(k - 3, 9 - k, 1));
            };
            r = f(0);
            g = f(8);
            b = f(4);
        }
        return `#${Math.round(r * 255).toString(16).padStart(2, '0')}${Math.round(g * 255).toString(16).padStart(2, '0')}${Math.round(b * 255).toString(16).padStart(2, '0')}`;
    }

    // 十六进制转HSL（用于同步指示器）
    function hexToHsl(hex) {
        const r = parseInt(hex.slice(1, 3), 16) / 255;
        const g = parseInt(hex.slice(3, 5), 16) / 255;
        const b = parseInt(hex.slice(5, 7), 16) / 255;
        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        let h, s, l = (max + min) / 2;

        if (max === min) {
            h = s = 0;
        } else {
            const d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            switch (max) {
                case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                case g: h = (b - r) / d + 2; break;
                case b: h = (r - g) / d + 4; break;
            }
            h *= 60;
        }
        return { h, s: s * 100, l: l * 100 };
    }

    // 同步指示器到颜色
    function syncIndicatorToColor(hex) {
        const indicator = document.getElementById('color-indicator');
        if (!indicator) return;

        const { h, l } = hexToHsl(hex);
        indicator.style.left = `${(h / 360) * 100}%`;
        indicator.style.top = `${((50 - l) / 40) * 100}%`;
    }

    // ===== 3. 核心功能函数 =====
    // 设置目标颜色（起始/结束）
    function setTargetColor(color) {
        if (colorSelTarget === 'start') {
            startColorInput.value = color;
            startColorSwatch.style.backgroundColor = color;
        } else {
            endColorInput.value = color;
            endColorSwatch.style.backgroundColor = color;
        }
        updatePreview();
    }

    // 更新颜色方块
    function updateColorSwatch(input) {
        const color = input.value;
        if (input.id === 'start-color') {
            startColorSwatch.style.backgroundColor = color;
        } else {
            endColorSwatch.style.backgroundColor = color;
        }
    }

    // 生成渐变文字（Minecraft格式）
    function generateGradientText() {
        const text = gradientInput.value;
        const startColor = startColorInput.value;
        const endColor = endColorInput.value;

        if (!text) {
            alert('请输入要转换的文字');
            return;
        }

        // 验证颜色格式
        const colorRegex = /^#[0-9A-F]{6}$/i;
        if (!colorRegex.test(startColor) || !colorRegex.test(endColor)) {
            alert('请输入有效的颜色代码（例：#ff0000）');
            return;
        }

        // 获取符号类型（§ 或 &）
        const symbolType = document.querySelector('input[name="color-symbol"]:checked')?.value || 'section';
        const colorPrefix = symbolType === 'section' ? '§' : '&';

        // 获取选中的文字格式
        const formats = Array.from(document.querySelectorAll('input[name="text-format"]:checked'))
            .map(checkbox => {
                switch(checkbox.value) {
                    case 'bold': return 'l';      // 粗体格式代码
                    case 'italic': return 'o';   // 斜体格式代码
                    case 'underline': return 'n'; // 下划线格式代码
                    case 'strikethrough': return 'm'; // 删除线格式代码
                    case 'obfuscated': return 'k'; // 乱码格式代码
                    default: return '';
                }
            })
            .filter(Boolean);

        let result = '';
        const startR = parseInt(startColor.slice(1, 3), 16);
        const startG = parseInt(startColor.slice(3, 5), 16);
        const startB = parseInt(startColor.slice(5, 7), 16);
        const endR = parseInt(endColor.slice(1, 3), 16);
        const endG = parseInt(endColor.slice(3, 5), 16);
        const endB = parseInt(endColor.slice(5, 7), 16);

    for (let i = 0; i < text.length; i++) {
        const ratio = i / (text.length - 1 || 1);
        const r = Math.round(startR + (endR - startR) * ratio);
        const g = Math.round(startG + (endG - startG) * ratio);
        const b = Math.round(startB + (endB - startB) * ratio);

        const rHex = r.toString(16).padStart(2, '0');
        const gHex = g.toString(16).padStart(2, '0');
        const bHex = b.toString(16).padStart(2, '0');

        const colorCode = `${colorPrefix}x${colorPrefix}${rHex[0]}${colorPrefix}${rHex[1]}`
            + `${colorPrefix}${gHex[0]}${colorPrefix}${gHex[1]}`
            + `${colorPrefix}${bHex[0]}${colorPrefix}${bHex[1]}`;

        // 添加格式代码
        const formatCodes = formats.map(fmt => colorPrefix + fmt).join('');

        result += colorCode + formatCodes + text[i];
        }

        // 显示结果并启用复制按钮
        resultElement.textContent = result;
        resultElement.dataset.result = result;
        copyBtn.disabled = false;

        // 更新预览样式
        updatePreview();
    }


    // 更新预览
    function updatePreview() {
            const text = gradientInput.value || '渐变文字预览';
            const startColor = startColorInput.value;
            const endColor = endColorInput.value;

            // 获取选中的文字格式
            const formats = Array.from(document.querySelectorAll('input[name="text-format"]:checked'))
                .map(checkbox => checkbox.value);

            let previewHtml = '';
            const startR = parseInt(startColor.slice(1, 3), 16);
            const startG = parseInt(startColor.slice(3, 5), 16);
            const startB = parseInt(startColor.slice(5, 7), 16);
            const endR = parseInt(endColor.slice(1, 3), 16);
            const endG = parseInt(endColor.slice(3, 5), 16);
            const endB = parseInt(endColor.slice(5, 7), 16);

            for (let i = 0; i < text.length; i++) {
                const ratio = i / (text.length - 1 || 1);
                const r = Math.round(startR + (endR - startR) * ratio);
                const g = Math.round(startG + (endG - startG) * ratio);
                const b = Math.round(startB + (endB - startB) * ratio);
                const hex = `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;

                // 构建样式字符串
                let style = `color: ${hex};`;
                if (formats.includes('bold')) style += 'font-weight: bold;';
                if (formats.includes('italic')) style += 'font-style: italic;';
                if (formats.includes('underline')) style += 'text-decoration: underline;';
                if (formats.includes('strikethrough')) style += 'text-decoration: line-through;';

                previewHtml += `<span style="${style}">${text[i]}</span>`;
            }

            textPreview.innerHTML = previewHtml;
        }

    // 复制到剪贴板
    function copyToClipboard() {
        const text = resultElement.dataset.result || resultElement.textContent;
        if (!text) return;

        navigator.clipboard.writeText(text).then(() => {
            // 显示复制成功提示（右上角弹窗）
            const notification = document.createElement('div');
            notification.className = 'fixed top-4 left-1/2 bg-green-500 text-white px-4 py-2 rounded shadow-lg z-50 transition-all duration-500';
            notification.textContent = '复制成功！';
            document.body.appendChild(notification);

            // 2秒后自动消失
            setTimeout(() => {
                notification.classList.add('opacity-0');
                setTimeout(() => notification.remove(), 500);
            }, 2000);
        }).catch(err => {
            console.error('复制失败:', err);
            alert('复制失败，请手动复制');
        });
    }

    // ===== 事件绑定 =====
    // 切换颜色目标（起始/结束）
    startColorInput.addEventListener('click', () => {
        colorSelTarget = 'start';
        syncIndicatorToColor(startColorInput.value);
        highlightSelectedColor(startColorInput.value);
    });
    endColorInput.addEventListener('click', () => {
        colorSelTarget = 'end';
        syncIndicatorToColor(endColorInput.value);
        highlightSelectedColor(endColorInput.value);
    });
    startColorSwatch.addEventListener('click', () => startColorInput.click());
    endColorSwatch.addEventListener('click', () => endColorInput.click());

    // 输入颜色时同步
    startColorInput.addEventListener('input', () => {
        updateColorSwatch(startColorInput);
        syncIndicatorToColor(startColorInput.value);
        highlightSelectedColor(startColorInput.value);
        updatePreview();
    });
    endColorInput.addEventListener('input', () => {
        updateColorSwatch(endColorInput);
        syncIndicatorToColor(endColorInput.value);
        highlightSelectedColor(endColorInput.value);
        updatePreview();
    });

    // 文字变化时更新预览
    gradientInput.addEventListener('input', updatePreview);

    // 生成按钮点击事件
    generateBtn.addEventListener('click', generateGradientText);

    // 复制按钮点击事件
    copyBtn.addEventListener('click', copyToClipboard);

    // 符号类型切换时更新预览
    document.querySelectorAll('input[name="color-symbol"]').forEach(radio => {
        radio.addEventListener('change', updatePreview);
    });
    // 添加格式选择变化时的事件监听
    document.querySelectorAll('input[name="text-format"]').forEach(checkbox => {
        checkbox.addEventListener('change', updatePreview);
    });

    // ===== 初始化 =====
    initColorPalette();      // 初始化单色块选择器
    initGradientPicker();    // 初始化渐变选择器
    updatePreview();         // 初始预览
    highlightSelectedColor(startColorInput.value); // 初始高亮单色块
});

// 修复特殊符号复制功能
function initSymbolCopy() {
  // 为所有符号元素绑定点击复制事件
  document.querySelectorAll('.symbol-item').forEach(item => {
    // 先移除可能存在的旧事件，避免重复绑定
    item.removeEventListener('click', copySymbol);
    // 绑定新的复制事件
    item.addEventListener('click', copySymbol);
  });
}

// 复制符号的具体实现
// 特殊符号复制功能 - 强制绑定版
document.addEventListener('DOMContentLoaded', function() {
    // 强制绑定所有符号按钮，无视界面状态
    function forceBindCharCopy() {
        // 直接选中所有.char-btn，不管是否隐藏
        const charButtons = document.querySelectorAll('.char-btn');

        // 遍历所有按钮，逐个绑定事件
        charButtons.forEach(btn => {
            // 移除所有旧事件（彻底清除可能的冲突）
            const clone = btn.cloneNode(true);
            btn.parentNode.replaceChild(clone, btn);

            // 给新元素绑定点击事件
            clone.addEventListener('click', function() {
                const char = this.textContent.trim(); // 获取符号

                // 尝试复制
                try {
                    navigator.clipboard.writeText(char).then(() => {
                        showCopySuccess(char);
                    }).catch(() => {
                        // 剪贴板API失败时用备用方案
                        fallbackCopy(char);
                    });
                } catch (err) {
                    fallbackCopy(char);
                }
            });
        });
    }

    // 复制成功提示
    function showCopySuccess(char) {
        const toast = document.createElement('div');
        toast.style.cssText = `
            position: fixed;
            top: 20px; /* 距离顶部20px */
            left: 50%; /* 水平居中 */
            background: #10b981;
            color: white;
            padding: 8px 16px;
            border-radius: 4px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            z-index: 9999;
            transition: all 0.3s;
        `;
        toast.textContent = `已复制: ${char}`;
        document.body.appendChild(toast);

        // 自动消失
        setTimeout(() => {
            toast.style.opacity = '0';
            setTimeout(() => toast.remove(), 300);
        }, 2000);
    }

    // 备用复制方案（兼容性100%）
    function fallbackCopy(char) {
        const textarea = document.createElement('textarea');
        textarea.value = char;
        textarea.style.position = 'fixed'; // 不影响页面布局
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy'); // 旧版复制API
        document.body.removeChild(textarea);
        showCopySuccess(char);
    }

    // 页面加载完成后立即绑定，并且每隔1秒再检查一次（防止动态生成的按钮没绑定）
    forceBindCharCopy();
    setInterval(forceBindCharCopy, 1000);
});
//QQ刷新
function updateAvatar(qq) {
    const img = document.getElementById('qqAvatar');
    const timestamp = new Date().getTime(); // 时间戳，防止缓存
    img.src = `https://q1.qlogo.cn/g?b=qq&nk=${qq}&s=100&t=${timestamp}`;
}

// 初始加载
updateAvatar(1782764161);
updateAvatar(3466829709);
updateAvatar(2506442080);
updateAvatar(3337913379);
updateAvatar(1564722665);
updateAvatar(3262178852);

// 每 30 秒刷新一次
setInterval(() => updateAvatar(1782764161), 30000);
setInterval(() => updateAvatar(3466829709), 30000);
setInterval(() => updateAvatar(2506442080), 30000);
setInterval(() => updateAvatar(3337913379), 30000);
setInterval(() => updateAvatar(1564722665), 30000);
setInterval(() => updateAvatar(3262178852), 30000);

// 加载并渲染MD文件内容（修复版 + 表格边框 + 锚点跳转）
async function loadMcmmoContent() {
    try {
        const response = await fetch('mcmmo-commands.md');
        if (!response.ok) throw new Error('文件加载失败');

        let mdContent = await response.text();
        const contentElement = document.getElementById('mcmmo-content');

        // 1. 处理标题并添加锚点ID
        mdContent = mdContent.replace(/^(#+) (.*)$/gm, (match, level, text) => {
            const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-');
            return `<h${level.length} id="${id}" class="text-${4-level.length}xl font-bold mt-${6-level.length} mb-${4-level.length}">${text}</h${level.length}>`;
        });

        // 2. 处理引用块
        mdContent = mdContent.replace(/^> (.*)$/gm, '<blockquote class="pl-4 border-l-4 border-gray-300 italic text-gray-700 my-4">$1</blockquote>');

        // 3. 处理表格（加边框线）
        mdContent = mdContent.replace(/^\|(.*)\|$/gm, (match) => {
            let cells = match.split('|').filter(c => c.trim() !== '');
            if (!cells.length) return match;
            if (cells.some(cell => cell.includes(':-:'))) {
                return '<tr class="border-b-2 border-gray-300">' +
                    cells.map(cell => `<th class="px-4 py-2 text-left border border-gray-300">${cell.trim()}</th>`).join('') +
                    '</tr>';
            } else {
                return '<tr class="border-b border-gray-300">' +
                    cells.map(cell => `<td class="px-4 py-2 border border-gray-300">${cell.trim()}</td>`).join('') +
                    '</tr>';
            }
        });
        mdContent = mdContent.replace(/((?:<tr[\s\S]*?<\/tr>\s*)+)/g, '<table class="min-w-full border-collapse mb-4 border border-gray-300">$1</table>');

        // 4. 处理无序列表
        mdContent = mdContent.replace(/^- (.*)$/gm, '<li class="ml-6 mb-1">$1</li>');
        mdContent = mdContent.replace(/(<li.*?<\/li>)+/gm, '<ul class="list-disc mb-4">$&</ul>');

        // 5. 处理有序列表
        mdContent = mdContent.replace(/^\d+\. (.*)$/gm, '<li class="ml-6 mb-1">$1</li>');
        mdContent = mdContent.replace(/(<li.*?<\/li>)+/gm, (match) => {
            if (!match.includes('ul')) return `<ol class="list-decimal mb-4 ml-6">$&</ol>`;
            return match;
        });

        // 6. 处理代码块
        mdContent = mdContent.replace(/```([\s\S]*?)```/g, '<pre class="bg-gray-100 p-4 rounded-md overflow-x-auto my-4"><code>$1</code></pre>');
        mdContent = mdContent.replace(/`([^`]+)`/g, '<code class="bg-gray-100 px-1 py-0.5 rounded">$1</code>');

        // 7. 处理链接（支持锚点跳转）
        mdContent = mdContent.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (match, text, href) => {
            if (href.startsWith('#')) {
                const targetId = href.substring(1).toLowerCase().replace(/[^a-z0-9]+/g, '-');
                return `<a href="#${targetId}" class="skill-link text-blue-500 hover:underline">${text}</a>`;
            }
            return `<a href="${href}" target="_blank" class="text-blue-500 hover:underline">${text}</a>`;
        });

        // 8. 处理段落（解决空行间距过大）
        mdContent = mdContent.replace(/^(?!<h|<ul|<ol|<table|<blockquote|<pre)(.*)$/gm, (match) => {
            if (match.trim() === '') return '';
            return `<p class="my-2">${match}</p>`;
        });

        contentElement.innerHTML = mdContent;
        initSkillLinks();

    } catch (error) {
        document.getElementById('mcmmo-content').innerHTML = `
            <div class="text-center text-red-500 py-10">
                <i class="fas fa-exclamation-circle text-2xl mb-2"></i>
                <p>内容加载失败，请稍后重试</p>
            </div>
        `;
        console.error('MD文件加载错误:', error);
    }
}

function initSkillLinks() {
    document.querySelectorAll('.skill-link').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').replace(/^#/, '');
            const targetElement = document.getElementById(targetId);

            if (targetElement) {
                const modalContent = document.querySelector('#level-guide-modal .overflow-y-auto');
                modalContent.scrollTo({
                    top: targetElement.offsetTop - 20,
                    behavior: 'smooth'
                });
            }
        });
    });
}

function showLevelGuideModal() {
    const modal = document.getElementById('level-guide-modal');
    modal.classList.remove('opacity-0', 'invisible');
    modal.querySelector('div').classList.remove('scale-95');
    modal.querySelector('div').classList.add('scale-100');

    if (document.getElementById('mcmmo-content').innerHTML.includes('加载内容中')) {
        loadMcmmoContent();
    }
}

function hideLevelGuideModal() {
    const modal = document.getElementById('level-guide-modal');
    modal.classList.add('opacity-0', 'invisible');
    modal.querySelector('div').classList.remove('scale-100');
    modal.querySelector('div').classList.add('scale-95');
}

document.addEventListener('DOMContentLoaded', function() {
    const levelGuideBtn = document.querySelector('a[href="javascript:showLevelGuideModal()"]');
    if (levelGuideBtn) {
        levelGuideBtn.addEventListener('click', showLevelGuideModal);
    }
});
// 玩家信息查询模块
// ？待开发