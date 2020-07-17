export function handleTilesLoading(source, callback){
    let tilesLoading = true
    let tilesProgress = '0%'

    let loading = 0;
    let loaded = 0;

    let update = () => {
        let progress = (loaded / loading * 100).toFixed(1) + '%';
        tilesProgress = progress;

        if (loading === loaded) {
            loading = 0
            loaded = 0
            tilesLoading = false
        }

        if(loading > loaded){
            tilesLoading = true
        }

        callback(tilesLoading, tilesProgress)
    }

    source.on('tileloadstart', () => {
        if(loading === 0){
            tilesLoading = false
        }
        ++loading
        update()
    });

    source.on('tileloadend', () => {
        setTimeout(function() {
            ++loaded
            update()
        }, 100);
    })
}