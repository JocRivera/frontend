import * as Icon from "react-icons/md";
import '../../styles/Homepage.css'
function HomePage() {
  return (
    <div>
    <header className="masthead">
        <div className="container">
          <div className="masthead-subheading">Disfruta</div>
          <div className="masthead-heading text-uppercase">Los lagos</div>
          <a className="btn btn-primary btn-xl text-uppercase" href="reservas.html">Reserva</a>
        </div>
      </header>

      {/* Services */}
      <section className="page-section" id="services">
        <div className="container">
          <div className="text-center">
            <h2 className="section-heading text-uppercase">Planes</h2>
            <h3 className="section-subheading text-muted">
              En la hosteria los lagos puedes disfrutar de nuestros planes que se acomodan a tus necesidades y presupuesto
            </h3>
          </div>
          <div className="row text-center">
            {/* Repeat for each service */}
            <div className="col-md-4">
              <span className="fa-stack fa-4x">
                <i className="fas fa-circle fa-stack-2x color-azul-claro"></i>
                <i className="fas fa-heart fa-stack-1x fa-inverse"></i>
              </span>
              <h4 className="my-3">Romantico</h4>
              <p className="text-muted">
                Sorprende a tu pareja con una hermosa decoración, donde puedes celebrar tu aniversario, cumpleaños, luna de miel o simplemente una fecha especial. Disfruta de una cena romántica y relájate en nuestro Spa. ¡Anímate y reserva ya!
              </p>
            </div>
            {/* Agrega más servicios según sea necesario */}
            <div class="col-md-4">
                    <span class="fa-stack fa-4x">
                        <i class="fas fa-circle fa-stack-2x color-azul-claro"></i>
                        <i class="fas fa-swimmer fa-stack-1x fa-inverse"></i>
                    </span>
                    <h4 class="my-3">Dia de sol</h4>
                    <p class="text-muted">El Mejor Plan cerca a Medellín. Piscinas, Almuerzo,
                        turco, Juegos, Canchas y poder disfrutar con amigos y familia.</p>
                </div>
                <div class="col-md-4">
                    <span class="fa-stack fa-4x">
                        <i class="fas fa-circle fa-stack-2x color-azul-claro"></i>
                        <i class="fas fa-spa fa-stack-1x fa-inverse"></i>
                    </span>
                    <h4 class="my-3">Spa</h4>
                    <p class="text-muted">En SPA Hostería Los Lagos disfruta la mejor
                        forma de relajación y una experiencia inolvidable.</p>
                </div>
                <div class="col-md-4">
                    <span class="fa-stack fa-4x">
                        <i class="fas fa-circle fa-stack-2x color-azul-claro"></i>
                        <i class="fas fa-users fa-stack-1x fa-inverse"></i>
                    </span>
                    <h4 class="my-3">Empresarial</h4>
                    <p class="text-muted">La Mejor integración con Alimentación,
                        Recreación, Auditorios Música, Transporte, Zonas Húmedas.
                        Nosotros lo hacemos fácil.</p>
                </div>
                <div class="col-md-4">
                    <span class="fa-stack fa-4x">
                        <i class="fas fa-circle fa-stack-2x color-azul-claro"></i>
                        <i class="fas fa-cake fa-stack-1x fa-inverse"></i>
                    </span>
                    <h4 class="my-3">Cumpleaños</h4>
                    <p class="text-muted">Tenemos el plan perfecto para celebrar tus cumpleaños.
                        (Para grupos entre 5 y 12 personas)</p>
                </div>
                <div class="col-md-4">
                    <span class="fa-stack fa-4x">
                        <i class="fas fa-circle fa-stack-2x color-azul-claro"></i>
                        <i class="fas fa-bed fa-stack-1x fa-inverse"></i>
                    </span>
                    <h4 class="my-3">Alojamiento</h4>
                    <p class="text-muted">Plan sencillo de amanecida</p>
                </div>
          </div>
        </div>
      </section>
      </div>
  )
}

export default HomePage