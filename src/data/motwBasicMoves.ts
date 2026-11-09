import { RatingName } from '../types/motw';

export interface BasicMoveDefinition {
  id: string;
  name: string;
  rating: RatingName;
  trigger: string;
  description: string;
  success10: string;
  partial79: string;
  fail6: string;
  advanced12?: string;
  questions?: string[];
  options?: string[];
}

export const MOTW_BASIC_MOVES: BasicMoveDefinition[] = [
  {
    id: 'agir_sob_pressao',
    name: 'Agir sob Pressão',
    rating: 'Firmeza',
    trigger: 'Quando você agir sob pressão ou perigo iminente...',
    description: 'Role +Firmeza para superar um obstáculo urgente, manter a compostura ou escapar de uma armadilha fatal.',
    success10: 'Você faz exatamente o que pretendia sem complicações, hesitação ou perdas.',
    partial79: 'O Guardião lhe oferecerá uma escolha difícil, um preço a pagar, um custo inesperado ou um resultado imperfeito.',
    fail6: 'As coisas saem perigosamente do controle. O Guardião faz um movimento duro ou suave contra você.',
    advanced12: 'Você faz o que pretendia e ainda conquista um benefício ou vantagem tática adicional além do esperado.',
  },
  {
    id: 'dar_uma_mao',
    name: 'Dar uma Mão (Ajudar)',
    rating: 'Firmeza',
    trigger: 'Quando você der uma mão ou ajudar outro caçador em sua ação...',
    description: 'Role +Firmeza para apoiar um aliado. Se passar, seu bônus é somado à rolagem dele.',
    success10: 'Você concede +1 de bônus na rolagem do seu aliado, sem se colocar em perigo imediato.',
    partial79: 'Você concede o bônus de +1 ao aliado, mas você mesmo se expõe ao perigo ou sofre uma complicação imediata.',
    fail6: 'Sua tentativa de ajuda atrapalha gravemente a ação ou você atrai todo o perigo para você mesmo.',
    advanced12: 'Você concede +2 de bônus na rolagem dele e ambos ganham vantagem tática na próxima ação.',
  },
  {
    id: 'investigar_um_misterio',
    name: 'Investigar um Mistério',
    rating: 'Esperteza',
    trigger: 'Quando você investigar um mistério procurando pistas...',
    description: 'Role +Esperteza para analisar pistas na cena do crime, arquivos antigos, conversar com testemunhas ou examinar vestígios.',
    success10: 'Faça 2 perguntas da lista abaixo ao Guardião. Ganhe +1 contínuo ao agir de acordo com as respostas obtidas.',
    partial79: 'Faça 1 pergunta da lista abaixo ao Guardião. Ganhe +1 contínuo ao agir de acordo com a resposta obtida.',
    fail6: 'Você encontra algo perturbador, chama atenção indesejada ou interpreta uma pista de forma perigosa e falsa.',
    advanced12: 'Faça até 3 perguntas da lista (ou qualquer pergunta razoável fora da lista) e ganhe +1 contínuo.',
    questions: [
      'O que aconteceu aqui?',
      'Em que tipo de criatura estamos lidando?',
      'O que essa criatura é capaz de fazer?',
      'Qual é a fraqueza ou vulnerabilidade do monstro?',
      'Para onde a criatura foi ou para onde vai agora?',
      'O que ela estava tentando fazer?',
      'O que está sendo escondido de nós aqui?',
    ],
  },
  {
    id: 'manipular_alguem',
    name: 'Manipular Alguém',
    rating: 'Sutileza',
    trigger: 'Quando você tentar manipular alguém para que faça algo que você quer...',
    description: 'Role +Sutileza (precisa oferecer uma razão crível, suborno, ameaça ou apelo convincente).',
    success10: 'Para um PNJ: ele fará o que você pede sem hesitar. Para outro Caçador: se ele fizer o que você propôs, ele marca 1 de experiência.',
    partial79: 'Para um PNJ: ele fará o que você pede, mas exigirá uma garantia concreta, promessa, pagamento ou prova prévia. Para outro Caçador: a escolha é dele, mas se fizer ele ganha 1 XP.',
    fail6: 'A pessoa se ofende, desconfia de você, fecha a porta na sua cara ou se torna abertamente hostil.',
    advanced12: 'O alvo faz o que você quer agora e se torna seu aliado/leal enquanto a situação atual perdurar.',
  },
  {
    id: 'partir_pra_porrada',
    name: 'Partir pra Porrada',
    rating: 'Braveza',
    trigger: 'Quando você entrar em combate corpo a corpo ou trocação franca de tiros...',
    description: 'Role +Braveza. Você e o alvo causam dano um ao outro de acordo com o poder e tags das armas envolvidas.',
    success10: 'Você causa dano normal ao alvo e escolhe 1 opção extra da lista abaixo:',
    partial79: 'Você e o alvo causam dano um ao outro de forma mútua sem escolhas extras.',
    fail6: 'O inimigo ataca você com violência total sem sofrer dano, ou você sofre um revés crítico.',
    advanced12: 'Você causa dano ao alvo e escolhe 2 opções extras da lista abaixo:',
    options: [
      'Você causa dano terrível (+1 de dano no alvo).',
      'Você sofre menos dano (-1 de dano sofrido).',
      'Você força o alvo a recuar ou derruba-o no chão.',
      'Você protege ou afasta alguém do perigo imediato.',
    ],
  },
  {
    id: 'proteger_alguem',
    name: 'Proteger Alguém',
    rating: 'Braveza',
    trigger: 'Quando você se interpor para proteger alguém de um ataque ou perigo...',
    description: 'Role +Braveza para absorver, desviar ou intervir em um perigo destinado a outra pessoa ou aliado.',
    success10: 'Você protege a pessoa. Você sofre o dano no lugar dela e escolhe 1 opção extra da lista:',
    partial79: 'Você protege a pessoa, mas sofre todo o dano e efeitos que seriam infligidos a ela.',
    fail6: 'Você falha em proteger o alvo e ambos sofrem o dano total ou ficam encurralados.',
    advanced12: 'Você protege a pessoa sem sofrer dano, revida causando dano ao atacante ou escolhe 2 opções extras:',
    options: [
      'Você sofre -1 de dano daquele ataque.',
      'Todo o dano do ataque é reduzido em 1 para todos.',
      'Você desarma ou empurra o atacante para trás com violência.',
      'Você atrai toda a atenção e agressão do inimigo exclusivamente para você.',
    ],
  },
  {
    id: 'perceber_uma_enrascada',
    name: 'Perceber uma Enrascada',
    rating: 'Esperteza',
    trigger: 'Quando você avaliar rapidamente um ambiente hostil ou perigoso...',
    description: 'Role +Esperteza para analisar a cena tática, identificar rotas de fuga e ameaças ocultas.',
    success10: 'Faça 3 perguntas da lista abaixo. Ganhe +1 adiante ao agir de acordo com as respostas obtidas.',
    partial79: 'Faça 1 pergunta da lista abaixo. Ganhe +1 adiante ao agir de acordo com a resposta obtida.',
    fail6: 'Você hesita, fica cego para a emboscada ou interpreta a ameaça erroneamente.',
    advanced12: 'Faça 3 perguntas da lista e ganhe +1 contínuo enquanto permanecer nesta situação ruim.',
    questions: [
      'Qual é a melhor rota de fuga ou saída?',
      'Qual inimigo é a ameaça mais perigosa?',
      'O que aqui é mais vulnerável a mim ou ao meu grupo?',
      'O que está prestes a acontecer a seguir?',
      'O que está sendo ocultado ou fora do meu campo de visão?',
      'Como posso proteger os inocentes aqui presentes?',
    ],
  },
  {
    id: 'usar_magia',
    name: 'Usar Magia',
    rating: 'Estranheza',
    trigger: 'Quando você lançar um feitiço, realizar um ritual ou manipular forças sobrenaturais...',
    description: 'Role +Estranheza. Escolha um dos efeitos mágicos que deseja produzir.',
    success10: 'A magia funciona como você pretendia, sem efeitos colaterais imprevistos.',
    partial79: 'A magia funciona, mas o Guardião escolhe 1 complicação mágica da lista:',
    fail6: 'A magia sai totalmente do controle. Entidades ou forças hostis se manifestam.',
    advanced12: 'A magia funciona com potência excepcional e o Guardião concede um efeito mágico benéfico adicional.',
    options: [
      'O efeito da magia é fraco ou de curta duração.',
      'A magia atrai atenção indesejada de monstros ou forças ocultas.',
      'A magia afeta mais alvos do que o pretendido.',
      'A magia causa 1 de dano a você ignorando armadura.',
      'Você precisará de um tempo considerável para se recuperar.',
    ],
  },
];
