import { createFileRoute } from "@tanstack/react-router";
import { SimNotice } from "@/components/SiteShell";
import { piciRainfall } from "@/lib/local-study";
import {
  alagamentosPorBairro,
  bairrosNaTabela,
  escalaRanking,
  hidricas2012a2025,
  hidricas2025,
  somaTabelaBairros,
  totalAlagamentosObservatorio,
} from "@/lib/flood-ranking";

export const Route = createFileRoute("/estudo-local")({
  head: () => ({
    meta: [
      { title: "Estudo geotécnico e hidrológico local — SADRE 2.0" },
      { name: "description", content: "Chuvas, solos, aquíferos e histórico de alagamentos de Fortaleza com dados de INMET, UFC, UECE e Prefeitura." },
      { property: "og:title", content: "Estudo geotécnico e hidrológico local — SADRE 2.0" },
      { property: "og:description", content: "Base de dados reais e fontes citadas para o SADRE 2.0 em Fortaleza." },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Estudo,
});

const fontes = {
  inmet: { n: "INMET — Normais Climatológicas 1991–2020, estação Fortaleza (82397)", u: "https://clima.inmet.gov.br/NormaisClimatologicas/1991-2020/precipitacao_acumulada_mensal_anual" },
  inmetTab: { n: "Olho no Tempo — tabela das normais INMET 1991–2020 (estação 82397)", u: "https://olhonotempo.com.br/clima/fortaleza-ce" },
  funceme: { n: "FUNCEME — Calendário de Chuvas do Ceará", u: "https://chuvas.funceme.br/anual/ceara/media/" },
  idf: { n: "Farias & Pinto — Atlas Pluviométrico do Brasil, Fortaleza/PICI, ANA 00338001 (CPRM, 2015), equações 02–03 e tabelas 01–02", u: "https://rigeo.sgb.gov.br/items/a2a25d7f-8fcc-40f5-8a5a-9e35abe5af0e" },
  abas1: { n: "Ribeiro, Cavalcante & Colares — Aspectos geológicos e hidrogeológicos da faixa costeira leste da RMF (Rev. Águas Subterrâneas/ABAS)", u: "https://aguassubterraneas.abas.org/asubterraneas/article/download/23451/15538/84958" },
  abas2: { n: "Pedrosa et al. — Ocupação das dunas em Fortaleza e impactos nas águas subterrâneas (ABAS)", u: "https://aguassubterraneas.abas.org/asubterraneas/article/download/28076/18201/103332" },
  scielo: { n: "Paisagem dunar em área urbana consolidada: Fortaleza (Sociedade & Natureza/SciELO)", u: "https://www.scielo.br/j/sn/a/zB3xpzPJQqS4JvzjCdH33Yv/?lang=pt" },
  uece: { n: "Santos, Juliana Moreira dos — Alagamentos e inundações em Fortaleza-CE: uma análise diacrônica (dissertação, 2021; publicação no catálogo UECE, 2022)", u: "https://siduece.uece.br/siduece/trabalhoAcademicoPublico.jsf?id=105878" },
  maran: { n: "Almeida & Carvalho — Inundações na bacia do rio Maranguapinho (Rev. Bras. Geomorfologia, 2010)", u: "https://rbgeomorfologia.org.br/rbg/article/download/150/144/431" },
  pmf: { n: "Prefeitura de Fortaleza — Índice de Vulnerabilidade às Mudanças Climáticas e Plano de Adaptação", u: "https://urbanismoemeioambiente.fortaleza.ce.gov.br/images/urbanismo-e-meio-ambiente/forclima/indice_de_vulnerabilidade_as_mudancas_climaticas.pdf" },
  obs: { n: "Prefeitura de Fortaleza / Ipplan — Observatório de Riscos Climáticos, Análise de ocorrências da Defesa Civil (2017–2026)", u: "https://observatorio.fortaleza.ce.gov.br/riscos-climaticos/analise-de-ocorrencias" },
  obsAlag: { n: "Observatório de Riscos Climáticos — Análise de ocorrências filtrada por Tipologia = Alagamento (2017–2026)", u: "https://observatorio.fortaleza.ce.gov.br/riscos-climaticos/analise-de-ocorrencias?tipo%5B0%5D=1" },
  dc2025: { n: "A Notícia do Ceará — Passaré e Centro lideram lista de riscos climáticos em 2025, diz Defesa Civil de Fortaleza (24/11/2025)", u: "https://anoticiadoceara.com.br/passare-e-centro-lideram-lista-de-riscos-climaticos-em-2025-diz-defesa-civil-de-fortaleza/" },
  diario26: { n: "Diário do Nordeste — Entre riscos de desabamento e alagamentos, Fortaleza tem média de 200 ocorrências por mês (07/05/2026)", u: "https://diariodonordeste.verdesmares.com.br/ceara/entre-riscos-de-desabamento-e-alagamentos-fortaleza-tem-media-de-200-ocorrencias-por-mes-1.3759327" },
} as const;
type F = keyof typeof fontes;

const meses: [string, number][] = [
  ["Jan", 156], ["Fev", 187], ["Mar", 337], ["Abr", 385], ["Mai", 229], ["Jun", 130],
  ["Jul", 70], ["Ago", 20], ["Set", 14], ["Out", 10], ["Nov", 10], ["Dez", 37],
];
const max = 385;

function Cite({ f }: { f: F[] }) {
  return (
    <span className="font-mono text-[10px] text-muted-foreground">
      {" "}Fonte: {f.map((k, i) => (
        <span key={k}>{i > 0 && "; "}<a href={fontes[k].u} target="_blank" rel="noreferrer" className="underline hover:text-primary">{fontes[k].n.split(" — ")[0]}</a></span>
      ))}
    </span>
  );
}

function Card({ t, children }: { t: string; children: React.ReactNode }) {
  return <div className="rounded border border-border bg-card p-5"><h3 className="font-bold">{t}</h3><div className="mt-2 space-y-2 text-sm text-muted-foreground">{children}</div></div>;
}

function Estudo() {
  return (
    <div className="space-y-10">
      <header>
        <p className="font-mono text-xs uppercase text-primary">Fase 3 · Estudo documental concluído</p>
        <h1 className="text-4xl font-extrabold">Estudo geotécnico e hidrológico local</h1>
        <p className="mt-2 max-w-3xl text-muted-foreground">Levantamento de dados publicados sobre chuva, solo, águas subterrâneas e alagamentos em Fortaleza, com fonte em cada informação.</p>
        <p className="mt-3 text-sm font-semibold">Revisão documental: 21/11/2026 · Investigações de campo: não realizadas.</p>
      </header>

      <SimNotice>Conclusão limitada à etapa documental. Não há rua-piloto definida, sondagens, medições do lençol freático nem aprovação de projeto executivo. Os cenários de bairros do simulador continuam ilustrativos.</SimNotice>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold">1. Regime de chuvas</h2>
        <div className="grid gap-3 sm:grid-cols-4">
          {[["Chuva média anual", "1.584 mm"], ["Mês mais chuvoso", "Abril · 385 mm"], ["Quadra chuvosa (fev–mai)", "≈ 1.138 mm (72%)"], ["Mês mais seco", "Out/Nov · 10 mm"]].map(([l, v]) => (
            <div key={l} className="rounded border border-border bg-card p-4">
              <p className="font-mono text-[10px] uppercase text-muted-foreground">NORMAL CLIMATOLÓGICA · {l}</p>
              <p className="text-xl font-extrabold text-primary">{v}</p>
            </div>
          ))}
        </div>
        <div className="rounded border border-border bg-card p-5">
          <p className="text-sm font-semibold">Chuva média mensal (mm) — normal 1991–2020</p>
          <div className="mt-4 flex h-48 items-end gap-1">
            {meses.map(([m, v]) => (
              <div key={m} className="flex flex-1 flex-col items-center justify-end gap-1">
                <span className="font-mono text-[10px]">{v}</span>
                <div className="w-full rounded-t bg-primary" style={{ height: `${(v / max) * 140}px` }} />
                <span className="font-mono text-[10px] text-muted-foreground">{m}</span>
              </div>
            ))}
          </div>
          <Cite f={["inmet", "inmetTab"]} />
          <p className="mt-3 text-xs text-muted-foreground">Valores mensais arredondados transcritos da tabela secundária Olho no Tempo, atribuída ao INMET; não houve validação da planilha primária nesta revisão. A soma dos meses arredondados é 1.585 mm, enquanto a tabela informa 1.584 mm anuais. Não são chuvas observadas em cada bairro nem chuvas de projeto.</p>
        </div>
        <p className="text-sm text-muted-foreground">Leitura para o SADRE: aproximadamente 72% da média anual se concentra entre fevereiro e maio. Isso orienta o planejamento sazonal do reaproveitamento, mas não informa quantos eventos encherão um reservatório. A série diária por posto deve ser consultada na FUNCEME.<Cite f={["funceme"]} /></p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold">1.1. Chuvas de projeto — referência oficial PICI</h2>
        <p className="text-sm text-muted-foreground">O Atlas da CPRM/SGB (2015) publica relações intensidade–duração–frequência para Fortaleza, na estação PICI, código ANA 00338001, operada pela FUNCEME no campus da UFC. O método utiliza desagregação de máximas diárias; não equivale a observações diretas de cada chuva de curta duração.<Cite f={["idf"]} /></p>
        <div className="overflow-x-auto rounded border border-border">
          <table className="w-full min-w-[540px] text-left text-sm">
            <caption className="p-3 text-left font-semibold">Altura estimada (mm) / intensidade (mm/h), por tempo de retorno</caption>
            <thead className="bg-muted"><tr><th className="p-3">Duração</th>{[2, 10, 25, 100].map(tr => <th key={tr} className="p-3">TR {tr} anos</th>)}</tr></thead>
            <tbody>{[15, 30, 60, 120, 1440].map(minutes => (
              <tr key={minutes} className="border-t border-border">
                <th className="p-3 font-semibold">{minutes < 60 ? `${minutes} min` : `${minutes / 60} h`}</th>
                {[2, 10, 25, 100].map(tr => {
                  const r = piciRainfall(minutes, tr);
                  return <td key={tr} className="p-3 font-mono text-xs">{r.depthMm.toLocaleString("pt-BR", { maximumFractionDigits: 1 })} / {r.intensityMmH.toLocaleString("pt-BR", { maximumFractionDigits: 1 })}</td>;
                })}
              </tr>
            ))}</tbody>
          </table>
        </div>
        <p className="text-xs text-muted-foreground">Recalculado pelas equações 02–03 do relatório, com arredondamento a uma casa decimal. Faixa: 5 minutos a 24 horas; retornos tabulados de 2 a 100 anos. TR 10 anos representa probabilidade anual de excedência de 10%, não uma chuva que ocorre obrigatoriamente a cada dez anos.<Cite f={["idf"]} /></p>
        <p className="text-sm text-muted-foreground"><b>Critério de projeto:</b> definir duração a partir do tempo de concentração e escolher o retorno conforme o risco e as exigências do órgão responsável. Para a reservação, simular entrada, saída, armazenamento inicial e diversas durações; a chuva média anual não dimensiona o extravasor. A referência de 2015 deve ser revisada quanto à representatividade atual antes de uso executivo.</p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold">2. Geologia, solos e águas subterrâneas</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <Card t="Formação Barreiras">
            <p>Sedimentos terciários areno-argilosos que formam os tabuleiros costeiros. Constituem o sistema aquífero Barreiras.<Cite f={["abas1"]} /></p>
            <p><b>Implicação:</b> a fração argilosa pode reduzir a infiltração. São necessários ensaios de permeabilidade em cada local.</p>
          </Card>
          <Card t="Dunas e paleodunas">
            <p>Depósitos quaternários arenosos que formam o sistema aquífero Dunas/Paleodunas. As dunas captam águas pluviais, alimentam o lençol freático e ajudam a evitar cheias urbanas.<Cite f={["abas1", "scielo"]} /></p>
            <p><b>Implicação:</b> depósitos arenosos podem favorecer a infiltração; sua taxa, a profundidade do lençol e a vulnerabilidade devem ser medidas no trecho, não inferidas pelo bairro.</p>
          </Card>
          <Card t="Qualidade da água subterrânea">
            <p>Estudos registram cloretos (intrusão marinha) e nitrato (falta de saneamento) nas águas das dunas de Fortaleza.<Cite f={["abas2"]} /></p>
            <p><b>Implicação:</b> infiltrar água de rua pode agravar a contaminação. Filtragem isolada não garante segurança para poluentes dissolvidos; tratamento e eventual impermeabilização dependem de análises.</p>
          </Card>
          <Card t="Relevo">
            <p>O estudo da bacia do Maranguapinho descreve condicionantes de inundação e ocupação de áreas suscetíveis. Essa leitura não substitui a topografia nem representa todas as ruas de Fortaleza.<Cite f={["maran"]} /></p>
            <p><b>Implicação:</b> reservação local e controle do excedente ganham importância onde a declividade é baixa.</p>
          </Card>
        </div>
        <p className="text-xs text-muted-foreground">Escala de evidência: a publicação sobre Barreiras e Dunas/Paleodunas aborda a faixa costeira leste da Região Metropolitana de Fortaleza. É referência regional, não um perfil de sondagem dos bairros do simulador.<Cite f={["abas1"]} /></p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold">3. Histórico de alagamentos e risco</h2>
        <div className="grid gap-4 md:grid-cols-3">
          <Card t="1.479 ocorrências (1983–2019)">
            <p>Levantamento no jornal O Povo, com concentração significativa na área central. As causas apontadas são a impermeabilização, a degradação da drenagem natural e a deficiência da drenagem artificial.<Cite f={["uece"]} /></p>
          </Card>
          <Card t="Bacia do rio Maranguapinho">
            <p>Ocupação de áreas sujeitas a inundação, sobretudo por população vulnerável, formando territórios de risco.<Cite f={["maran"]} /></p>
          </Card>
          <Card t="Plano municipal de adaptação">
            <p>A Prefeitura mapeou índices de risco climático e pontos críticos (hotspots) atuais e futuros, incluindo alagamentos.<Cite f={["pmf"]} /></p>
          </Card>
        </div>
        <p className="text-xs text-muted-foreground">As 1.479 ocorrências foram catalogadas a partir de jornais: não são um cadastro completo da Defesa Civil, um total de eventos meteorológicos independentes ou um ranking atualizado de bairros.</p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold">3.1 Bairros que mais sofrem no período chuvoso</h2>
        <p className="text-sm text-muted-foreground">O Observatório de Riscos Climáticos de Fortaleza publica o histórico de chamados da Defesa Civil. Filtrando a tipologia <b>Alagamento</b> no período 2017–2026, os bairros abaixo concentram o maior número de registros.<Cite f={["obs", "obsAlag"]} /></p>
        <div className="overflow-x-auto rounded border border-border">
          <table className="w-full min-w-[560px] text-left text-sm">
            <caption className="p-3 text-left font-semibold">Chamados por alagamento · 2017–2026</caption>
            <thead className="bg-muted"><tr><th className="p-3">#</th><th className="p-3">Bairro</th><th className="p-3">Chamados</th><th className="p-3">Participação relativa</th></tr></thead>
            <tbody>
              {alagamentosPorBairro.map((b, i) => (
                <tr key={b.nome} className="border-t border-border">
                  <td className="p-3 font-mono text-xs text-muted-foreground">{i + 1}</td>
                  <th className="p-3 font-semibold">{b.nome}</th>
                  <td className="p-3 font-mono">{b.chamados}</td>
                  <td className="p-3"><div className="h-2 w-full min-w-[120px] rounded bg-muted"><div className="h-2 rounded bg-primary" style={{ width: `${escalaRanking(b.chamados)}%` }} /></div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-muted-foreground">A página informa {totalAlagamentosObservatorio.toLocaleString("pt-BR")} chamados para a tipologia no período; a tabela por bairro soma {somaTabelaBairros.toLocaleString("pt-BR")} em {bairrosNaTabela} bairros — os {totalAlagamentosObservatorio - somaTabelaBairros} restantes não têm bairro atribuído na fonte. Chamado é solicitação registrada na Defesa Civil, não área alagada medida: depende de quem aciona o órgão e da classificação dada ao caso.<Cite f={["obsAlag"]} /></p>
        <div className="grid gap-4 md:grid-cols-2">
          <Card t="Série mais longa · 2012 a julho de 2025">
            <p>Nas ocorrências hidrológicas (alagamento, inundação, deslizamento e riscos associados), o Barroso acumulou 217 chamados, seguido por Jangurussu, Genibaú, Quintino Cunha e Passaré.<Cite f={["dc2025"]} /></p>
            <ul className="font-mono text-xs">{hidricas2012a2025.map((b) => <li key={b.nome}>{b.nome}: {b.chamados}</li>)}</ul>
          </Card>
          <Card t="Só 2025, até julho">
            <p>A capital somou {hidricas2025.total} ocorrências hidrológicas, distribuídas principalmente entre os bairros abaixo.<Cite f={["dc2025"]} /></p>
            <ul className="font-mono text-xs">{hidricas2025.top.map((b) => <li key={b.nome}>{b.nome}: {b.chamados}</li>)}</ul>
          </Card>
        </div>
        <p className="text-sm text-muted-foreground">Os chamados se concentram entre fevereiro e abril, a quadra chuvosa cearense. Em 2026 a média foi de 206 ocorrências por mês no primeiro quadrimestre, e abril registrou 499 mm em Fortaleza, 36% acima da média histórica de 365,1 mm citada na reportagem — referência diferente da normal INMET de 385 mm para abril usada acima.<Cite f={["diario26"]} /></p>
        <SimNotice>Ranking de registros da Defesa Civil, não medição de campo do SADRE. Nenhum desses bairros foi vistoriado pelo projeto: a escolha do trecho-piloto continua sujeita ao plano de investigação da seção 5.</SimNotice>
      </section>

      <section className="space-y-3">
        <h2 className="text-2xl font-bold">4. Matriz de viabilidade preliminar</h2>
        <p className="text-sm text-muted-foreground">Interpretação conceitual do SADRE a partir das referências; não é conclusão dos autores citados nem autorização de obra.</p>
        <div className="grid gap-4 md:grid-cols-2">
          <Card t="Solo permeável e água subterrânea compatível"><p>Investigar infiltração controlada com pré-tratamento e extravasor. Confirmar permeabilidade, qualidade da água e afastamento seguro do lençol. Modelos A ou B podem ser estudados conforme tráfego e espaço disponível.</p></Card>
          <Card t="Baixa infiltração ou subleito sensível"><p>Priorizar estudo de reservação estanque e descarga controlada. Dimensionar suporte do pavimento e evitar saturação do subleito; não contar com infiltração para esvaziar o sistema.</p></Card>
          <Card t="Lençol raso ou indícios de contaminação"><p>Não aprovar infiltração com os dados atuais. Avaliar solução rasa e estanque ou outra localização, além de empuxo, flutuação e segurança da escavação.</p></Card>
          <Card t="Via de tráfego intenso ou redes conflitantes"><p>Avaliar solução híbrida, captação fora da pista e alternativa do Modelo C. Exigir levantamento de interferências, cargas de tráfego e capacidade da drenagem receptora.</p></Card>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold">5. Plano de investigação do trecho-piloto</h2>
        <p className="text-sm text-muted-foreground">Escopo proposto pela equipe SADRE. Quantidade, profundidade dos ensaios e critérios de aceitação devem ser definidos por profissionais habilitados, com responsabilidade técnica e normas vigentes.</p>
        <div className="overflow-x-auto rounded border border-border">
          <table className="w-full min-w-[620px] text-left text-sm">
            <thead className="bg-muted"><tr><th className="p-3">Levantamento necessário</th><th className="p-3">Entrega verificável</th><th className="p-3">Decisão que depende dele</th></tr></thead>
            <tbody>{[
              ["Rua, bacia e topografia", "Trecho georreferenciado, cotas, área contribuinte e redes existentes", "Localização, escoamento por gravidade e interferências"],
              ["Sondagens e subleito", "Perfis SPT, granulometria, plasticidade e ensaios de suporte/expansão aplicáveis", "Escavação, fundação e estrutura do pavimento"],
              ["Infiltração in situ", "Taxas medidas em pontos representativos e nas cotas previstas", "Infiltração viável ou reservatório estanque"],
              ["Água subterrânea", "Níveis e variação sazonal, incluindo a quadra chuvosa", "Afastamento do lençol, flutuação e segurança"],
              ["Qualidade da água", "Amostras de escoamento, sólidos, óleos e contaminantes relevantes", "Tratamento, destinação e usos não potáveis"],
              ["Hidrologia e rede receptora", "Série validada, IDF, tempo de concentração e capacidade de saída", "Reservatório, descarga controlada e extravasor"],
            ].map(([survey, delivery, decision]) => <tr key={survey} className="border-t border-border"><th className="p-3 font-semibold">{survey}</th><td className="p-3 text-muted-foreground">{delivery}</td><td className="p-3 text-muted-foreground">{decision}</td></tr>)}</tbody>
          </table>
        </div>
        <SimNotice>Todas as entregas de campo acima estão pendentes. Nenhum valor de permeabilidade, resistência do solo ou profundidade do lençol foi inventado ou atribuído a um bairro.</SimNotice>
      </section>

      <section className="space-y-3 border-t border-border pt-6">
        <h2 className="text-2xl font-bold">6. Parecer documental</h2>
        <p className="text-sm">As referências sustentam estudar drenagem distribuída, reservação e reaproveitamento em Fortaleza. Não comprovam o desempenho do SADRE nem a segurança de infiltrar ou escavar em uma rua específica. O próximo passo é selecionar um trecho e executar o plano de investigação antes de definir modelo, capacidade e solução estrutural.</p>
        <p className="text-sm font-semibold text-primary">Etapa documental concluída · Fase 3 aguardando validação de campo.</p>
      </section>

      <section className="space-y-2">
        <h2 className="text-2xl font-bold">Referências</h2>
        <p className="text-xs text-muted-foreground">Nesta revisão foram conferidos o PDF original da IDF PICI, a tabela secundária de normais e os registros bibliográficos UECE e ABAS (geologia regional). As demais referências são mantidas do levantamento anterior; não foram revalidadas integralmente. Nenhuma fonte fornece ensaios do trecho-piloto.</p>
        <ol className="list-decimal space-y-1 pl-5 text-sm">
          {Object.values(fontes).map((f) => (
            <li key={f.u}><a href={f.u} target="_blank" rel="noreferrer" className="underline hover:text-primary">{f.n}</a></li>
          ))}
        </ol>
      </section>
    </div>
  );
}
