import { Leaf, BookOpen } from "lucide-react";
export function Brand() {
  return (
    <a href="/" className="brand" aria-label="Aula Virtual, inicio">
      <span className="brand-mark">
        <Leaf size={23} />
        <BookOpen size={15} />
      </span>
      <span>
        Aula Virtual<strong>Ciencias Naturales</strong>
      </span>
    </a>
  );
}
