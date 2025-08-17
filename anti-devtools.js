// 检测开发者工具打开并跳转https://www.yuanshen.com/
(function() {
    const genshinUrl = "https://www.yuanshen.com/";

    // 1. 拦截快捷键
    document.addEventListener('keydown', function(e) {
        if (
            e.key === 'F12' ||
            (e.ctrlKey && e.shiftKey && e.key === 'I') ||
            (e.ctrlKey && e.key === 'u')
        ) {
            e.preventDefault();
            window.location.href = genshinUrl;
        }
    });

    // 2. 禁用右键菜单
    document.addEventListener('contextmenu', e => e.preventDefault());

    // 3. 优化的调试器检测（减少误判）
    let lastTime = performance.now();
    const checkDebugger = () => {
        const start = performance.now();
        // 仅当调试器打开时，debugger才会暂停，导致时间差变大
        debugger;
        const end = performance.now();

        // 如果执行时间超过100ms，说明调试器被打开（正常执行耗时极短）
        if (end - start > 100) {
            window.location.href = genshinUrl;
        }
        lastTime = end;
    };

    // 降低检测频率（减少本地调试干扰）
    setInterval(checkDebugger, 1000);
})();