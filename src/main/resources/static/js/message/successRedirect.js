window.onload = function() {
    function getUrlParameter(name) {
        name = name.replace(/[[]/, '\\[').replace(/[\]]/, '\\]');
        const regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
        const results = regex.exec(location.search);
        return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
    }

    const successParam = getUrlParameter('success');
    if (successParam === 'true') {
        document.getElementById('success-message').style.display = 'block';
    }
};