extern crate actix;
extern crate actix_web;
extern crate openssl;

use actix_web::*;
use openssl::ssl::{SslMethod, SslAcceptor, SslFiletype};


fn main() {
    let mut builder = SslAcceptor::mozilla_intermediate(SslMethod::tls()).unwrap();
    builder.set_private_key_file("ssl-cert-snakeoil.key", SslFiletype::PEM).unwrap();
    builder.set_certificate_chain_file("ssl-cert-snakeoil.pem").unwrap();

    let sys = actix::System::new("guide");
    HttpServer::new(|| Application::new().resource("/", |r| r.f(index)))
        .bind("127.0.0.1:8088")
        .expect("Can not bind to 127.0.0.1:8088")
        .threads(8)
        //.start();
        .start_ssl(builder).unwrap();

    let _ = sys.run();
}

fn index(_req: HttpRequest) -> &'static str {
    "Hello world!"
}
