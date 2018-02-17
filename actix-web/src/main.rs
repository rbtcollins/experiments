extern crate actix;
extern crate actix_web;

use actix_web::*;

fn main() {
    let sys = actix::System::new("guide");
    HttpServer::new(|| Application::new().resource("/", |r| r.f(index)))
        .bind("127.0.0.1:8088")
        .expect("Can not bind to 127.0.0.1:8088")
        .threads(8)
        .start();

    let _ = sys.run();
}

fn index(_req: HttpRequest) -> &'static str {
    "Hello world!"
}
