import SEO from '../../components/SEO/SEO'

const AuthSEO = ({ title, description }: { title: string; description: string }) => (
  <SEO
    title={title}
    description={description}
    noindex
    omitJsonLd
    omitCanonical
    omitKeywords
    omitSocial
  />
)

export default AuthSEO
