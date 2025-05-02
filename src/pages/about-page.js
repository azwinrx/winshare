import NavigationHelper from "../utils/navigation-helper.js";

export default class AboutPage {
  async render() {
    return `
      <section class="about-page" id="main-content">
        <div class="hero-section">
          <div class="container">
            <h1>Tentang WinShare</h1>
            <p class="hero-description">Platform berbagi cerita yang memungkinkan Anda mengabadikan dan membagikan momen berharga dengan komunitas.</p>
          </div>
        </div>

        <div class="container">
          <div class="mission-section">
            <h2>Misi Kami</h2>
            <p>Menghubungkan orang-orang melalui cerita dan pengalaman mereka, menciptakan ruang digital yang aman dan inspiratif untuk berbagi momen kehidupan.</p>
          </div>
          
          <div class="features-section">
            <h2>Fitur Utama</h2>
            <div class="feature-grid">
              <div class="feature-card">
                <i class="fas fa-camera-retro"></i>
                <h3>Ambil Foto</h3>
                <p>Ambil foto langsung dari kamera atau upload dari galeri Anda dengan mudah.</p>
              </div>
              
              <div class="feature-card">
                <i class="fas fa-map-marked-alt"></i>
                <h3>Tandai Lokasi</h3>
                <p>Bagikan lokasi cerita Anda dengan integrasi peta yang interaktif.</p>
              </div>
              
              <div class="feature-card">
                <i class="fas fa-users"></i>
                <h3>Komunitas</h3>
                <p>Bergabung dengan komunitas yang aktif dan inspiratif.</p>
              </div>
              
              <div class="feature-card">
                <i class="fas fa-mobile-alt"></i>
                <h3>Responsif</h3>
                <p>Akses dari berbagai perangkat dengan tampilan yang optimal.</p>
              </div>
            </div>
          </div>

          <div class="team-section">
            <h2>Pengembang</h2>
            <div class="team-grid">
              <div class="team-card">
                <img src="https://ui-avatars.com/api/?name=Azwin&background=3498db" alt="Creator">
                <h3>Azwin</h3>
                <p>Fullstack Developer</p>
              </div>
            </div>
          </div>

          <div class="contact-section">
            <h2>Hubungi Kami</h2>
            <div class="contact-info">
              <div class="contact-item">
                <i class="fas fa-envelope"></i>
                <p>azwinrifai321@gmail.com</p>
              </div>
              <div class="contact-item">
                <i class="fas fa-map-marker-alt"></i>
                <p>Bekasi, Indonesia</p>
              </div>
              <div class="social-links">
                <a href="https://github.com/azwinrx" target="_blank" class="social-link">
                  <i class="fab fa-github"></i>
                </a>
                <a href="https://x.com/azwinrx" target="_blank" class="social-link">
                  <i class="fab fa-twitter"></i>
                </a>
                <a href="https://www.linkedin.com/in/muhammad-azwin-rifai/" class="social-link">
                  <i class="fab fa-linkedin"></i>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    `;
  }

  async afterRender() {
    NavigationHelper.setupAuthenticatedNavigation();
  }
}
