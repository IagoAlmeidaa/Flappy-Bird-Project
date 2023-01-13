function newElement(tagName, className) {
    const elem = document.createElement(tagName)
    elem.className = className
    return elem
}

function Barrier(reverse = false) {
    this.element = newElement('div', 'barrier')

    const borda = newElement('div', 'borda')
    const corpo = newElement('div', 'corpo')
    this.element.appendChild(reverse ? corpo : borda)
    this.element.appendChild(reverse ? borda : corpo)

    this.setAltura = altura => corpo.style.height = `${altura}px`
}

// const b = new Barrier(true)
// b.setAltura(300)
// document.querySelector('[p-flappy]').appendChild(b.element)

function DoubleBarriers(altura, abertura, x) {
    this.element = newElement('div', 'barriers')

    this.superior = new Barrier(true)
    this.inferior = new Barrier(false)

    this.element.appendChild(this.superior.element)
    this.element.appendChild(this.inferior.element)

    this.aperture = () => {
        const alturaSuperior = Math.random() * (altura - abertura)
        const alturaInferior = altura - abertura - alturaSuperior
        this.superior.setAltura(alturaSuperior)
        this.inferior.setAltura(alturaInferior)
    }
    this.getX = () => parseInt(this.element.style.left.split('px')[0])
    this.setX = x => this.element.style.left = `${x}px`
    this.getLargura = () => this.element.clientWidth

    this.aperture()
    this.setX(x)
}

function Barriers(altura, largura, abertura, espaco, pontos) {
    this.pares = [
        new DoubleBarriers(altura, abertura, largura),
        new DoubleBarriers(altura, abertura, largura + espaco),
        new DoubleBarriers(altura, abertura, largura + espaco * 2),
        new DoubleBarriers(altura, abertura, largura + espaco * 3)
    ]

    const deslocamento = 3
    this.animar = () => {
        this.pares.forEach(par => {

            par.setX(par.getX() - deslocamento)
            if (par.getX() < -par.getLargura()) {
                par.setX(par.getX() + espaco * this.pares.length)
                par.aperture()
            }
            const meio = largura / 2
            const cruzouMeio = par.getX() + deslocamento >= meio
                && par.getX < meio
            if (cruzouMeio) pontos()
        })
    }

}

function Bird(alturaJogo){
    let fly = false
    
    this.element = newElement('img', 'bird')
    this.element.src = 'img/passaro.png'

    this.getY = () => parseInt(this.element.style.bottom.split('px')[0])
    this.setY = y => this.element.style.bottom = `${y}px`

    window.onkeydown = e => fly = true
    window.onkeyup = e => fly = false
    window.onmousedown = e => fly = true
    window.onmouseup = e => fly = false

    this.animar = () => {
        const novoY = this.getY() + (fly ? 8 : -5)
        const alturaMaxima = alturaJogo - this.element.clientHeight

        if(novoY <= 0){
            this.setY(0)
        }else if (novoY >= alturaMaxima){
            this.setY(alturaMaxima)
        }else{
            this.setY(novoY)
        }
    }
    this.setY(alturaJogo / 2)
}

const barreiras = new Barriers(700, 1200, 200, 400)
const bird = new Bird(700)
const areaDoJogo = document.querySelector('[p-flappy]')

areaDoJogo.appendChild(bird.element)
barreiras.pares.forEach(par => areaDoJogo.appendChild(par.element))

setInterval(() => {
    barreiras.animar()
    bird.animar()
}, 20)