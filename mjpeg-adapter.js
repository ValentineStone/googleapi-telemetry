const { EventEmitter } = require('events')
const express = require('express')

const mjpegEE = new EventEmitter()

const mjpegCache = {
  current: Buffer.from( // default "video stream missing" icon 240x320
    '/9j/4AAQSkZJRgABAQEAYABgAAD/4QBmRXhpZgAATU0AKgAAAAgABAEaAAUAAAABAAAAPg' +
    'EbAAUAAAABAAAARgEoAAMAAAABAAMAAAExAAIAAAAQAAAATgAAAAAAAJOjAAAD6AAAk6MA' +
    'AAPocGFpbnQubmV0IDQuMy43AP/bAEMAAgEBAQEBAgEBAQICAgICBAMCAgICBQQEAwQGBQ' +
    'YGBgUGBgYHCQgGBwkHBgYICwgJCgoKCgoGCAsMCwoMCQoKCv/bAEMBAgICAgICBQMDBQoH' +
    'BgcKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCv' +
    '/AABEIAPABQAMBIQACEQEDEQH/xAAfAAABBQEBAQEBAQAAAAAAAAAAAQIDBAUGBwgJCgv/' +
    'xAC1EAACAQMDAgQDBQUEBAAAAX0BAgMABBEFEiExQQYTUWEHInEUMoGRoQgjQrHBFVLR8C' +
    'QzYnKCCQoWFxgZGiUmJygpKjQ1Njc4OTpDREVGR0hJSlNUVVZXWFlaY2RlZmdoaWpzdHV2' +
    'd3h5eoOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1d' +
    'bX2Nna4eLj5OXm5+jp6vHy8/T19vf4+fr/xAAfAQADAQEBAQEBAQEBAAAAAAAAAQIDBAUG' +
    'BwgJCgv/xAC1EQACAQIEBAMEBwUEBAABAncAAQIDEQQFITEGEkFRB2FxEyIygQgUQpGhsc' +
    'EJIzNS8BVictEKFiQ04SXxFxgZGiYnKCkqNTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZn' +
    'aGlqc3R1dnd4eXqCg4SFhoeIiYqSk5SVlpeYmZqio6Slpqeoqaqys7S1tre4ubrCw8TFxs' +
    'fIycrS09TV1tfY2dri4+Tl5ufo6ery8/T19vf4+fr/2gAMAwEAAhEDEQA/AP2gooAKKACi' +
    'gAooAKKACigAooAKKACigAooAKKACigAooAKKACigAooAKKACigAooAKKACigAooAKKACi' +
    'gAooAKKACigAooAKKACigAooAKKACigAooAKKACigAooAKKACigAooAKKACigAooAKKACi' +
    'gAooAKKACigAooAKKACigAooAKKACigAooAKKACigAooAKKACigAooAKKACigAooAKKACi' +
    'gAooAKKACigAooAKKACigAooAKKACigAooAKKACigAooAKKACigAooAKKACigAooAKKACi' +
    'gAooAKKACigAooAKKACigAooAKKACigAooAKKACigAooAKKACigAooAKKACigAooAKKACi' +
    'gAooAKKACigAooAKKACigAooAKKACigAooAKKACigAooAKKACigAooAKKACigAooAKKACi' +
    'gAooAKKACigAooAKKACigAooAKKACigAooAKKACigAooAKKACigAooAKKACigAooAKKACi' +
    'gAooAKKACigAooAKKACigAooAKKACigAooAKKACigAooAKKACigAooAKKACigAooAKKACi' +
    'gAooAKKACigAooAKKACigAooAKKACigAooAKKACigAooAKKACigAooAKKACigAo59aelg1' +
    'uHPrRSAKKACigAooAKKACigAooAKKACigAooAKKACigAooAKKACigAooAKKACuV+JXxIg8' +
    'E2q2lmiy6hMuYo2+6i/3m/oO9AF3wJ4703xvpvnwER3UYxc2xblT6j1U+tbtABRQAUUAFF' +
    'ABRQAUUAFFABRQAUUAFFABRQAUUAFFABRQAUUAFFABRQAUUAFFABWN418FaX410s2d6uyZ' +
    'Mm3uFX5o2/qPUUAeMzReJvht4mxlre6t2yrDlZV/9mU/55r2LwJ4703xvpvnwYjuoxi5ti' +
    'eVPqPVT60AbtFABRQAUUAFFABRQAUUAFFABRQAUUAFFABRQAUUAFFABRQAUUAFFABRQAUU' +
    'AFZvjHWLjw/4YvtYtUVpIIC0e7pu6A/rQB4TrninX/EhU63qTXGxiU3KPlz6YHFRaHrmpe' +
    'HdSj1bSrgxzRng9mHcH1BoA9w8CeO9N8bab58BEd1GALm2zyp9R6qa5P4nx/ELwrM2saP4' +
    'kvJNOkbkbgTAT2PH3fQ/gfcA4z/hZfjz/oaLr/vof4Uf8LL8ef8AQ0XX/fQ/woA9W+E/ij' +
    'UvFXhb7Zqzh5obhomkC43gAEE+/Nb2ratp+h6fJqmqXKwwwrl3b+XufagCt4V8QR+KNDi1' +
    'yGAxpMz+WrHnaGIGffitGgAooAKKACigAooAKKACigAooAKKACigAooAKKACigAooAKKAC' +
    'sH4n/8iDqn/Xv/AOzCgDwWigC5oeual4d1KPVtJuDHNGfwYdwR3Br2zwX400b4g6OytEgm' +
    'Cbbyzk5xn+amgDzn4n/DCbwpM2saPG0mnSNyOpgJ7H/Z9D+B9+NoA9Y+DGrafonw/vNT1S' +
    '5WGGK+cs7f7q8e59q4n4g/EHUPG+ofxQ2UTf6Pb5/8eb1b+X8wD1H4Q/8AJPdP+kn/AKMa' +
    'uloAKKACigAooAKKACigAooAKKACigAooAKKACigAooAKKACigArB+J//Ig6p/17/wDswo' +
    'A8FooAKt6JrepeHtSj1XSrgxzRng9iPQjuDQB7b4L8aaP8QdGZWiQTBNt5Zyc4z391Nec/' +
    'E/4YTeFZm1jR42k06RuV6mAnsf8AZ9D+B9wDlG1K+bTl0k3LfZ1lMiw9t5AGfrgVBQB7n8' +
    'If+Se6f9JP/RjV0tABRQAUUAFFABRQAUUAFFABRQAUUAFFABRQAUUAFFABRQAUUAFYPxP/' +
    'AORB1T/r3/8AZhQB4LRQAUUAW9E1vUvD2pR6rpVwY5ozwexHcH1Br23wX400f4gaOytGgm' +
    'CbbyzfnGf5qaAPOvif8MJvCszazo0bSafI3zL1MBPY/wCz6H8D78ZQB7n8If8Aknun/ST/' +
    'ANGNXS0AFFABRQAUUAFFABRQAUUAFFABRQAUUAFFABRQAUUAFFABRQAVg/E//kQdU/69/w' +
    'D2YUAeC0UAFFABVvRNc1Lw7qUeq6VcGOaM8Hsw9D6g0Ae2+C/Gmj/EDR2VokEwTbeWcnOM' +
    '9/dTXnXxP+F83hWZtY0aNpNPkb5l6mAnsf8AZ9D+B9wD0D4Q/wDJPdP+kn/oxq6WgAooAK' +
    'KACigAooAKKACigAooAKKACigAooAKKACigAooAKKACs3xjo9x4g8MX2j2rKslxAVj3dN3' +
    'UD9KAPF3+GPj2Nyh8M3HBx8uCP503/hWnjz/AKFe6/75H+NAB/wrTx5/0K91/wB8j/Gj/h' +
    'Wnjz/oV7r/AL5H+NAB/wAK08ef9Cvdf98j/Gj/AIVp48/6Fe6/75H+NAEKjxR8PNfjleKS' +
    'zvIgGCt0ZT29GBr2LwX400f4g6MytEgmCbbyzk5xnv7qaANXQ9FsfD2mppOmqywxsxjVjn' +
    'bli2PoM1boAKKACigAooAKKACigAooAKKACigAooAKKACigAooAKKACigAooAKKACigAoo' +
    'AxvGvgrS/Gul/Yr1dkyc29wo+aNv6j1FeNPa+Kvh34pWKNXhvIm/d7ASsyn0/vA/55oA90' +
    '0a6v73Sre61Ox+zXEkYaaDdnY3pVqgAooAKKACigAooAKKACigAooAKKACigAooAKKACig' +
    'AooAKKACigAooAKKACigAqvc6Xp15dQ3t3ZRyTW7EwSOgJQnrigCxRQAUUAFFABRQAUUAF' +
    'FABRQAUUAFFABRQAUUAFFABRQAUUAFFABRQAUUAFFABRQAUUAFFABRQAUUAFFABRQAUUAF' +
    'FABRQAUUAFFABRQAUUAFFABRQAUUAFFABRQAUUAFFABRQAUUAFFABRQAUUAFFABRQAUUAF' +
    'FABRQAUUAFFABRQAUUAFFABRQAUUAFFABRQAUUAFFABRQAUUAFFABRQAUUAFFABRQAUUAF' +
    'FABRQAUUAFFABRQAUUAFFABRQAUUAFFABRQAUUAFFABRQAUUAFFABRQAUUAFFABRQAUUAF' +
    'FABRQAUUAFFABRQAUUAFFABRQAUUAFFABRQAUUAFFABRQAUUAFFABRQAUUAFFABRQAUUAF' +
    'FABRQAUUAFFABRQAUUAFFABRQAUUAFFABRQAUUAFFABRQAUUAFFABRQAUUAFFABRQAUUAF' +
    'FABRQAUUAFFABRQAUUAFFABRQAUUAFFABRQAUUAFFABRQAUUAFFABRQAUUAFFABRQAUUAF' +
    'FABRQAUUAFFABRQAUUAFFABRQAUUAFFABRQAUUAFFABRQAUUAFFABRQAUUAFFABRQAUUAF' +
    'FABRQAUUAFFABRQAUUAFFABRQAUUAFFABRQAUUAFFABRQAUUAFFABRQAUUAFFABRQAUUAF' +
    'FABRQAUUAFFABRQAUUAFFABRQAUUAFFABRQAUUAFFABRQB//2Q==',
    'base64',
  )
}

const buffToMultipart = buff => Buffer.concat([
  Buffer.from('--boundary\r\n'),
  Buffer.from('Content-Type: image/jpeg\r\n'),
  Buffer.from(`Content-Length: ${buff.length}\r\n`),
  Buffer.from('\r\n'),
  buff,
  Buffer.from('\r\n'),
])

const mjpegAdapter = ({ host, port, path, connected }) => recv => {
  const app = express()
  app.get(path, (req, res) => {
    res.writeHead(200, {
      'Cache-Control': 'no-store, no-cache, must-revalidate, pre-check=0, post-check=0, max-age=0',
      'Pragma': 'no-cache',
      'Connection': 'close',
      'Content-Type': 'multipart/x-mixed-replace; boundary=boundary'
    })
    const write = buff => res.write(buffToMultipart(buff))
    write(mjpegCache.current)
    mjpegEE.on('buff', write)
    req.on('close', () => mjpegEE.off('buff', write))
  })

  app.listen(port, host, () => connected?.(`mjpeg@${host}:${port}${path}`))
  const send = buff => {
    mjpegCache.current = buff
    mjpegEE.emit('buff', buff)
  }
  return send
}

module.exports = mjpegAdapter