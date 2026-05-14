const russianPlural = new Intl.PluralRules('ru-RU')

type PluralForms = {
  one: string
  few: string
  many: string
}

export const plural = (count: number, forms: PluralForms): string => {
  const rule = russianPlural.select(count) as keyof PluralForms
  return forms[rule] ?? forms.many
}
