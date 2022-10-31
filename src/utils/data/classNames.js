import classNames from 'classnames/bind';

const albumClass = (active, uid) => {
    return classNames({
        'albums_section_item_albums_block_item_bg': true,
        'active': active === uid,
    });  
};

const headerLogoClass = (play) => {
    return classNames({
        'user_header_item_logo': true,
        'played': play,
        'paused': play === false
    });  
};

export {albumClass, headerLogoClass};