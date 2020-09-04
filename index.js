(async function redirect() {
    const url = await (await fetch('./redirect.txt')).text();
    window.location.replace(url);
})();