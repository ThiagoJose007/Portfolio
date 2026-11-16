import { withTranslations, type FieldDef } from "../_components/field-defs";
import { TRANSLATABLE } from "@/lib/i18n/translations";

const FIELDS: FieldDef[] = [
  {
    name: "linksPhoto",
    label: "Foto da página de links",
    type: "image",
    nullable: true,
    help: "Vazio = usa a foto do Perfil.",
  },
  {
    name: "linksBio",
    label: "Frase curta",
    type: "textarea",
    rows: 2,
    placeholder: "Designer e dev. Escrevo sobre produto, design systems e front-end.",
    help: "Aparece no card principal, abaixo do nome e do cargo.",
  },
  { name: "cvUrl", label: "Currículo (PDF)", type: "file", nullable: true, help: "O mesmo CV do resto do site." },
  { name: "linksShowCv", label: "Mostrar o card do currículo", type: "boolean" },
  { name: "linksShowPortfolio", label: "Mostrar o card do portfolio (site completo)", type: "boolean" },
];

export const LINKS_SETTINGS_FIELDS = withTranslations(FIELDS, TRANSLATABLE.profile);
