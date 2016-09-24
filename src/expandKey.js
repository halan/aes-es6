// ## Expansão das chaves

// ### Importações

// Importa o passo subBytes que faz a substituição com a S-Box
import subBytes from './steps/subBytes'

// Importa xor, que recebe duas arrays de números e aplica um xor em cada elemento correspondente.
import { xor, group } from './utils'

// ### Constantes

// Constante rcon pra ser feito xor com o primeiro byte e cada word (1 word são 4 bytes)
// 1 RCON para cada nova chave criada, ou seja: 10 rcons.
const RCON = [0x01, 0x02, 0x04, 0x08, 0x10, 0x20, 0x40, 0x80, 0x1b, 0x36]

// Constante para definir o tamanho de uma chave em words:`4`
// Ou seja, 16 bytes, 16 letras, 128 bits; esse é o tamanho de uma chave.
// O AES foi construído para trabalhar com chaves de até 256 bits, mas decidi
// não implementar a encriptação utilizando outros tamanhos de chave. Se fosse o caso,
// haveria mais rodadas e portanto mais chaves e um rcon maior.
const WORDS_IN_A_KEY = 4

// Constante pra definir o tamanho em bytes de um word: `4`
const WORD_SIZE = 4

// ### KeyScheduleCore

// Esta função rotaciona os bytes de um word, ex:
// `[0, 1, 2, 3] -> [1, 2, 3, 0]`
const rotWord = word => [...word.slice(-(WORD_SIZE-1)), word[0]]

// subWord é a mesma coisa que o subBytes. No caso da expansão de chave esse procedimento é feito
// sobre uma word. Todo o procedimento de expansão de chave é baseado em words, que funcionam como
// subblocos. Entretanto o subBytes é apenas uma substituição de um byte por outro, se aplico em 4 bytes
// ou em 16 o procedimento em si não é alterado.
const subWord = subBytes

// Faz um xor no primeiro byte de uma word com rcon especificado.
// Esse procedimento é feito exatamente 16 vezes, um para cada valor de rcon.
const xorFirstByte = (word, value) => [ value ^ word[0], ...word.slice(1) ]

// Procedimento principal da expansão de chave. Aqui aplicamos a sequência:
// `rotWord`, `subWord` e por fim o `xor` no `rcon` correspondente da rodada.
// Esse procedimento é aplicado sempre na primeira word de cada chave, ou seja
// é aplicada tantas vezes iguais ao número de rodadas, que no noso caso são 11.
const keyScheduleCore = (word, rcon) => xorFirstByte(subWord(rotWord(word)), rcon)

// Função auxiliar que devolve as últimas words. A ideia aqui é pegar a primeira word da última chave
const lastWord = (arr) => arr.slice(-WORD_SIZE)

// ### Geração das chaves

// Separei nessa função, o procedimento de criar uma chave completa de 128 bits
// a partir de uma chave anterior e um valor de rcon.
const generate = (key, rcon) => {
  // Primeiramente calculo o valor base usando KeyScheduleCore que vai receber a última word da chave.
  const base = keyScheduleCore(lastWord(key), rcon)
  // divido a chave em grupos formando 4 words.
  const words = group(key, WORDS_IN_A_KEY)

  // Então faço um reduce em cima dessas words, ou seja, um loop de 4 iterações.
  return words.reduce( (k, word) => (
    // Em cada iteração ele monta mais uma word da chave
    // A primeira word é um xor com a primeira word da chave anterior e o valor base
    // As words seguintes é um xor com a word correspondente na chave anterior
    // e a última word calculado da própria chave
    [...k, ...xor(word, k.length ? lastWord(k) : base )]
  ), [])
}

// Finalmente a função de expansão de chave. Ela recebe uma chave e entrega 11!
export default key => (
  // Passo um reduce sobre os RCONS, epara cada RCON executo a função de gerar chave
  // passando como entrada a última chave e o rcon da rodada
  RCON.reduce( (keys, rcon) => {
    const [last] = [...keys].reverse()
    const current = generate(last, rcon)

    return [...keys, current]
  }, [key] )
)
