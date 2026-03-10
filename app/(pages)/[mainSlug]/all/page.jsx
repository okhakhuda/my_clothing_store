import ListCategories from '@/app/components/ListCategories/ListCategories'
import ListProducts from '@/app/components/ListProducts/ListProducts'

const page = async ({ params }) => {
  const { mainSlug: mainSlug } = params

  return (
    <>
      <ListCategories mainSlug={mainSlug} />
      <ListProducts mainSlug={mainSlug} />
    </>
  )
}

export default page
