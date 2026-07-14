import { APP_DISPLAY_NAME } from '@/lib/constants/appName'
import Logo from '@/assets/crx.svg'
import styles from './ContentWrapper.module.css'
import { ContentWrapperProps } from './ContentWrapper.types';

const ContentWrapper = ({ children }: ContentWrapperProps) => {
    return (
        <div className={styles.root}>
            <div className={styles.brand}>
                <img src={Logo} alt={`${APP_DISPLAY_NAME} logo`} className={styles.brandLogo} />
            </div>
            <span className={styles.eyebrow}>{APP_DISPLAY_NAME}</span>

            <div className={styles.content}>
                <div className={styles.children}>{children}</div>
            </div>
        </div>
    );
};

export default ContentWrapper;