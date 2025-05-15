// SGF примеры для демонстрации
const SIMPLE_SGF = "(;GM[1]FF[4]CA[UTF-8]SZ[19]RU[Japanese]KM[6.5]TM[1800]OT[5x30 byo-yomi]PB[Черный]PW[Белый]C[Простая демонстрационная игра];B[pd];W[dp];B[pp];W[dd];B[fc];W[cf];B[jd];W[qf];B[nd];W[rd];B[qc];W[ph];B[cn];W[fq];B[dk];W[qn])";

const COMPLEX_SGF = "(;GM[1]FF[4]CA[UTF-8]AP[CGoban:3]ST[2]RU[Japanese]SZ[19]KM[6.50]TM[1800]OT[5x30 byo-yomi]PB[Черный]PW[Белый]C[Сложная демонстрационная игра с комментариями];B[pd]C[Распространенное начальное движение.];W[dp]C[Стандартный ответ.];B[qp]C[Черные занимают угол.];W[dc]C[Белые занимают другой угол.];B[de]C[Черные приближаются к белым.];W[ce]C[Белые защищаются.];B[cf]C[Черные атакуют форму белых.];W[cd]C[Белые укрепляются.];B[df]C[Черные продолжают атаку.];W[fc]C[Белые обеспечивают базу.];B[cj]C[Черные развиваются в сторону.];W[oq]C[Белые атакуют другой угол.];B[po]C[Черные защищают свою территорию.];W[mp]C[Белые продолжают давление.];B[pq]C[Черные укрепляются.];W[op]C[Белые создают влияние.];B[pn]C[Черные строят моё.];W[jp]C[Белые расширяются.];B[cn]C[Черные занимают стратегическую позицию.])";

const JOSEKI_SGF = "(;GM[1]FF[4]CA[UTF-8]AP[CGoban:3]ST[2]RU[Japanese]SZ[19]KM[6.50]C[Стандартное дзёсэки угла];B[pd]C[Комоку - популярное первое движение];W[dp]C[Белые занимают угол];B[pp]C[Черные занимают противоположный угол];W[dd]C[Белые строят базу];B[pj]C[Черные укрепляют верхний правый];W[nc]C[Белые атакуют камень черных];B[oc]C[Черные защищаются];W[nd]C[Белые продолжают атаку];B[pf]C[Черные укрепляют свою группу];W[jc]C[Белые соединяются и формируют моё];B[fq]C[Черные атакуют нижний левый угол])";

const FUSEKI_SGF = "(;GM[1]FF[4]CA[UTF-8]SZ[19]KM[6.5]PB[Черные]PW[Белые]C[Пример фусэки - начальная стадия игры];B[pd];W[dp];B[pp];W[dc];B[pj];W[nc];B[jp];W[hq];B[qf];W[jd];B[cf];W[ch];B[cc];W[cd];B[bd];W[bc];B[ce];W[cb];B[dh];W[di];B[cg];W[eh];B[dg];W[dn])";

const LIFE_AND_DEATH_SGF = "(;GM[1]FF[4]CA[UTF-8]SZ[19]KM[6.5]PB[Черные]PW[Белые]C[Задача жизни и смерти - ход черных];AB[pd][qf][pf][og][ng][mg][lg][kf][je][jd][jc][kc][lc][mc][md][ne]AW[ke][le][me][nf][of][pe][qe][qd][qc][pc][oc][nc][nb][mb][lb][kb][jb]C[Черные ходят и живут. Найдите правильный ход.]B[oe];W[od];B[ld];W[mf];B[nd];W[lf];B[kg];W[pg];B[ph];W[qg];B[rg];W[qh];B[rh];W[re];B[rf];W[qi];B[ri]C[Черные группа теперь живет!])";

const HANDICAP_SGF = "(;GM[1]FF[4]CA[UTF-8]SZ[19]HA[4]KM[0.5]PB[Черные]PW[Белые]C[Партия с форой в 4 камня];AB[pd][dp][pp][dd];W[cn];B[fq];W[fc];B[cf];W[nc];B[qf];W[jd];B[db];W[dj];B[cl];W[dl];B[ck];W[cj];B[dm];W[em];B[dn];W[cm];B[dk];W[ek];B[bm];W[bn];B[bl];W[do];B[en];W[fm];B[co];W[bo];B[cp];W[bp];B[cq];W[bj];B[bk])";

const TERRITORY_SGF = "(;GM[1]FF[4]CA[UTF-8]SZ[19]KM[6.5]PB[Черные]PW[Белые]C[Пример игры, демонстрирующий территорию];B[pd];W[dp];B[pp];W[dd];B[cf];W[fc];B[bd];W[cc];B[ci];W[ck];B[cn];W[cp];B[ej];W[ek];B[fj];W[fk];B[gj];W[em];B[nq];W[nc];B[qf];W[pb];B[qc];W[kc];B[qn];W[jp];B[hp];W[jn];B[hn];W[eq];B[hm];W[hl];B[il];W[hk];B[jl];W[kn];B[kl];W[ln];B[ml];W[kq];B[hq];W[or];B[nr];W[qp];B[qo];W[pq];B[op];W[qq];B[rp];W[rq];B[oq];W[pr];B[ro];W[os];B[lr];W[kr];B[lq];W[lp];B[mp];W[lo];B[ks];W[js];B[ls];W[ir];B[fr];W[fq];B[gr];W[er];B[fs];W[es];B[ns];W[sp];B[so];W[sq];B[no])";

// Экспорт объекта с SGF примерами
const SGF_EXAMPLES = {
  "simple.sgf": SIMPLE_SGF,
  "complex.sgf": COMPLEX_SGF,
  "joseki.sgf": JOSEKI_SGF,
  "fuseki.sgf": FUSEKI_SGF,
  "life_and_death.sgf": LIFE_AND_DEATH_SGF,
  "handicap.sgf": HANDICAP_SGF,
  "territory.sgf": TERRITORY_SGF
}; 