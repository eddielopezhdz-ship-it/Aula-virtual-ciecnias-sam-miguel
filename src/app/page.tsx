import Link from "next/link";
import {
  ArrowUpRight,
  ArrowRight,
  BookOpen,
  FlaskConical,
  Leaf,
  Dna,
  Sprout,
  GraduationCap,
  Compass,
  Sparkles,
  CalendarDays,
  ChevronRight,
  Microscope,
  Globe2,
} from "lucide-react";
import { PageShell } from "@/components/shell";
import { ScienceArt } from "@/components/science-art";
import { subjects } from "@/lib/subjects";
import { Shield } from "lucide-react";
const icons = { leaf: Leaf, dna: Dna, flask: FlaskConical, sprout: Sprout };
export default function Home() {
  return (
    <PageShell>
      <section className="hero">
        <div className="container hero-grid">
          <div className="hero-copy">
            <div className="institution-identity">
              <Shield size={22} strokeWidth={1.3} />
              <span>
                I. E. San Miguel<small>Espacio para el escudo oficial</small>
              </span>
            </div>
            <div className="eyebrow">
              <span className="tiny-dot" /> APRENDER HOY. TRANSFORMAR EL MAÑANA.
            </div>
            <h1>
              La ciencia comienza
              <br />
              con una <span>pregunta.</span>
            </h1>
            <p className="hero-description">
              Bienvenidos al Aula Virtual de Ciencias Naturales, un espacio para
              explorar, comprender y descubrir el maravilloso mundo de la
              ciencia.
            </p>
            <div className="hero-actions">
              <Link href="/login" className="button">
                Explorar mi aula <ArrowUpRight size={18} />
              </Link>
              <Link href="/asignaturas" className="text-link">
                Conoce las asignaturas <ArrowRight size={16} />
              </Link>
            </div>
            <div className="hero-note">
              <span className="avatar-stack">
                <span>6°</span>
                <span>9°</span>
                <span>11°</span>
              </span>
              <p>
                Un mundo por descubrir.
                <strong>De sexto a undécimo, a tu ritmo.</strong>
              </p>
            </div>
          </div>
          <ScienceArt />
        </div>
        <div className="container hero-stats">
          <div>
            <BookOpen />
            <span>
              <strong>Aprendizaje con sentido</strong>
              <small>Conecta la ciencia con tu vida</small>
            </span>
          </div>
          <div>
            <Compass />
            <span>
              <strong>Explora a tu ritmo</strong>
              <small>Tu aula, donde tú estés</small>
            </span>
          </div>
          <div>
            <Sprout />
            <span>
              <strong>Crece y transforma</strong>
              <small>Conocimiento que cuida el planeta</small>
            </span>
          </div>
        </div>
      </section>
      <section className="section container" id="asignaturas">
        <div className="section-heading">
          <div>
            <div className="eyebrow">TU PRÓXIMO DESCUBRIMIENTO</div>
            <h2>Un aula para cada curiosidad.</h2>
            <p>Todo está conectado. Elige por dónde empezar a explorar.</p>
          </div>
          <Link href="/asignaturas" className="text-link">
            Ver asignaturas <ArrowUpRight size={17} />
          </Link>
        </div>
        <div className="subject-grid">
          {subjects.map((s) => {
            const Icon = icons[s.icon as keyof typeof icons];
            return (
              <Link
                key={s.id}
                href="/asignaturas"
                className={`subject-card ${s.color}`}
              >
                <div className="card-top">
                  <span className="subject-icon">
                    <Icon size={27} />
                  </span>
                  <ArrowUpRight size={19} />
                </div>
                <span className="grade-label">EXPLORA · APRENDE · CONECTA</span>
                <h3>{s.name}</h3>
                <p>{s.area}</p>
                <div className="card-bottom">
                  <span>
                    <BookOpen size={14} /> Explorar contenidos
                  </span>
                  <ChevronRight size={16} />
                </div>
              </Link>
            );
          })}
        </div>
      </section>
      <section className="learning-section">
        <div className="container learning-grid">
          <div className="learning-art">
            <div className="orbital">
              <Globe2 size={92} strokeWidth={1} />
              <span className="float-icon f1">
                <Microscope />
              </span>
              <span className="float-icon f2">
                <FlaskConical />
              </span>
              <span className="float-icon f3">
                <Leaf />
              </span>
              <span className="orbit-dot" />
            </div>
            <span className="art-caption">OBSERVA. PREGUNTA. DESCUBRE.</span>
          </div>
          <div>
            <div className="eyebrow">MÁS QUE MEMORIZAR, COMPRENDER</div>
            <h2>
              Aprende haciendo.
              <br />
              <span>Descubre conectando.</span>
            </h2>
            <p>
              La ciencia no solo está en los libros. Está en el agua que bebes,
              en las plantas de tu entorno y en cada pregunta que te haces.
            </p>
            <div className="learning-items">
              <div>
                <span>01</span>
                <p>
                  <strong>Explora y construye</strong>Parte de lo que sabes y
                  descubre nuevas ideas.
                </p>
              </div>
              <div>
                <span>02</span>
                <p>
                  <strong>Practica y experimenta</strong>Convierte los conceptos
                  en experiencias reales.
                </p>
              </div>
              <div>
                <span>03</span>
                <p>
                  <strong>Aplica y reflexiona</strong>Usa lo aprendido para
                  transformar tu entorno.
                </p>
              </div>
            </div>
            <Link href="/programacion" className="text-link">
              Conoce nuestra ruta de aprendizaje <ArrowRight size={17} />
            </Link>
          </div>
        </div>
      </section>
      <section className="section container">
        <div className="section-heading">
          <div>
            <div className="eyebrow">HERRAMIENTAS PARA IR MÁS LEJOS</div>
            <h2>Tu aprendizaje, sin límites.</h2>
          </div>
        </div>
        <div className="tool-grid">
          <Link href="/biblioteca" className="tool-card">
            <span className="tool-icon">
              <BookOpen />
            </span>
            <div>
              <h3>Biblioteca digital</h3>
              <p>Guías, infografías y recursos para seguir explorando.</p>
              <span className="text-link">
                Descubrir recursos <ArrowUpRight size={15} />
              </span>
            </div>
          </Link>
          <Link href="/programacion" className="tool-card">
            <span className="tool-icon blue-icon">
              <CalendarDays />
            </span>
            <div>
              <h3>Tu ruta de aprendizaje</h3>
              <p>Conoce los temas y objetivos de cada periodo.</p>
              <span className="text-link">
                Ver programación <ArrowUpRight size={15} />
              </span>
            </div>
          </Link>
          <Link href="/evaluaciones" className="tool-card">
            <span className="tool-icon orange-icon">
              <Sparkles />
            </span>
            <div>
              <h3>Pon a prueba tus ideas</h3>
              <p>Aprende de tus avances con actividades interactivas.</p>
              <span className="text-link">
                Explorar actividades <ArrowUpRight size={15} />
              </span>
            </div>
          </Link>
        </div>
      </section>
      <section className="container teacher-section">
        <div className="teacher-avatar">
          <GraduationCap size={42} />
        </div>
        <div className="teacher-copy">
          <div className="eyebrow">TE ACOMPAÑO EN EL CAMINO</div>
          <h2>La curiosidad nos une.</h2>
          <p>
            Cada pregunta es una oportunidad para aprender. Un espacio para
            descubrir juntos y construir un futuro más consciente.
          </p>
          <strong>Eddie Johan López Hernández</strong>
          <small>Docente de Ciencias Naturales y Educación Ambiental</small>
        </div>
        <span className="teacher-decoration" aria-hidden="true">
          <Sprout size={110} strokeWidth={0.8} />
        </span>
      </section>
      <section className="container cta-section">
        <div>
          <h2>Tu próxima gran idea empieza aquí.</h2>
          <p>Trae tu curiosidad. La ciencia tiene mucho que contarte.</p>
        </div>
        <Link href="/login" className="button light">
          Ingresar al aula <ArrowUpRight size={18} />
        </Link>
      </section>
    </PageShell>
  );
}
