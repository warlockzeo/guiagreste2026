import { Link, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import styles from './Plans.module.css';

export function Plans() {
  const [searchParams] = useSearchParams();
  const preselectedPlan = searchParams.get('plan') || 'free';

  return (
    <motion.div
      className={styles['plans']}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className={styles['plans__hero']}>
        <h1 className={styles['plans__title']}>
          Escolha seu Plano
        </h1>
        <p className={styles['plans__subtitle']}>
          Comece grátis e escale conforme sua loja cresce
        </p>
      </div>

      <div className={styles['plans__marketing']}>
        <div className={styles['plans__marketingContent']}>
          <h2 className={styles['plans__marketingTitle']}>
            Por que ser <span className={styles['plans__highlight']}>VIP</span>?
          </h2>
          <p className={styles['plans__marketingText']}>
            No agreste de Pernambuco, a concorrência é forte. Milhares de lojas competem pela atenção dos mesmos compradores. 
            <strong> Ser VIP é como ter uma loja na melhor esquina do Moda Center.</strong>
          </p>
          <ul className={styles['plans__benefitsList']}>
            <li>
              <span className={styles['plans__check']}>✓</span>
              <strong>Destaque nos Resultados:</strong> Sua loja aparece primeiro na busca, antes da concorrência
            </li>
            <li>
              <span className={styles['plans__check']}>✓</span>
              <strong>Badge Exclusivo:</strong> Selo "Destaque" que transmite confiança ao comprador
            </li>
            <li>
              <span className={styles['plans__check']}>✓</span>
              <strong>Fotos Ilimitadas:</strong> Mostre cada detalhe dos seus produtos sem limitações
            </li>
            <li>
              <span className={styles['plans__check']}>✓</span>
              <strong>Maior Visibilidade:</strong> Clientes encontram sua loja mais facilmente
            </li>
            <li>
              <span className={styles['plans__check']}>✓</span>
              <strong>Mais Vendas:</strong> Clientes VIP vendem em média 3x mais no Guiagreste
            </li>
          </ul>
          <p className={styles['plans__marketingCta']}>
            Enquanto outras lojas lutam para ser vistas, <strong>você já está no topo.</strong>
          </p>
        </div>
      </div>

      <div className={styles['plans__cards']}>
        <motion.div
          className={`${styles['plans__card']} ${preselectedPlan === 'free' ? styles['plans__card--selected'] : ''}`}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <div className={styles['plans__cardHeader']}>
            <h3 className={styles['plans__planName']}>Grátis</h3>
            <div className={styles['plans__price']}>
              <span className={styles['plans__currency']}>R$</span>
              <span className={styles['plans__amount']}>0</span>
              <span className={styles['plans__period']}>/mês</span>
            </div>
          </div>
          <ul className={styles['plans__features']}>
            <li className={styles['plans__feature']}>
              <span className={styles['plans__featureIcon']}>📷</span>
              <span><strong>5 fotos</strong> de produtos</span>
            </li>
            <li className={styles['plans__feature']}>
              <span className={styles['plans__featureIcon']}>🔍</span>
              <span>Aparecer na busca</span>
            </li>
            <li className={styles['plans__feature']}>
              <span className={styles['plans__featureIcon']}>💬</span>
              <span>Chat com clientes</span>
            </li>
            <li className={`${styles['plans__feature']} ${styles['plans__feature--disabled']}`}>
              <span className={styles['plans__featureIcon']}>✗</span>
              <span>Destaque nos resultados</span>
            </li>
            <li className={`${styles['plans__feature']} ${styles['plans__feature--disabled']}`}>
              <span className={styles['plans__featureIcon']}>✗</span>
              <span>Badge VIP</span>
            </li>
          </ul>
          <Link
            to={`/register?type=brand&plan=free`}
            className={styles['plans__btn']}
          >
            Começar Grátis
          </Link>
        </motion.div>

        <motion.div
          className={`${styles['plans__card']} ${styles['plans__card--vip']} ${preselectedPlan === 'vip' ? styles['plans__card--selected'] : ''}`}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className={styles['plans__cardHeader']}>
            <span className={styles['plans__badge']}>Mais Popular</span>
            <h3 className={styles['plans__planName']}>VIP</h3>
            <div className={styles['plans__price']}>
              <span className={styles['plans__currency']}>R$</span>
              <span className={styles['plans__amount']}>49</span>
              <span className={styles['plans__period']}>/mês</span>
            </div>
          </div>
          <ul className={styles['plans__features']}>
            <li className={`${styles['plans__feature']} ${styles['plans__feature--vip']}`}>
              <span className={styles['plans__featureIcon']}>♾️</span>
              <span><strong>Fotos ilimitadas</strong></span>
            </li>
            <li className={`${styles['plans__feature']} ${styles['plans__feature--vip']}`}>
              <span className={styles['plans__featureIcon']}>🏆</span>
              <span><strong>Destaque nos resultados</strong></span>
            </li>
            <li className={`${styles['plans__feature']} ${styles['plans__feature--vip']}`}>
              <span className={styles['plans__featureIcon']}>⭐</span>
              <span><strong>Badge VIP exclusivo</strong></span>
            </li>
            <li className={`${styles['plans__feature']} ${styles['plans__feature--vip']}`}>
              <span className={styles['plans__featureIcon']}>💬</span>
              <span>Chat com clientes</span>
            </li>
            <li className={`${styles['plans__feature']} ${styles['plans__feature--vip']}`}>
              <span className={styles['plans__featureIcon']}>📊</span>
              <span>Estatísticas avançadas</span>
            </li>
          </ul>
          <Link
            to={`/register?type=brand&plan=vip`}
            className={`${styles['plans__btn']} ${styles['plans__btn--vip']}`}
          >
            Quero ser VIP
          </Link>
          <p className={styles['plans__guarantee']}>
            🔒 Cancele quando quiser
          </p>
        </motion.div>
      </div>

      <div className={styles['plans__faq']}>
        <h3 className={styles['plans__faqTitle']}>Perguntas Frequentes</h3>
        <div className={styles['plans__faqGrid']}>
          <div className={styles['plans__faqItem']}>
            <h4>Posso mudar de plano?</h4>
            <p>Sim! Você pode fazer upgrade ou downgrade a qualquer momento.</p>
          </div>
          <div className={styles['plans__faqItem']}>
            <h4>Como funciona o destaque?</h4>
            <p>Lojas VIP aparecem nas primeiras posições em todas as buscas por categoria.</p>
          </div>
          <div className={styles['plans__faqItem']}>
            <h4>Quais formas de pagamento?</h4>
            <p>Cartão de crédito, PIX e boleto bancário.</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
