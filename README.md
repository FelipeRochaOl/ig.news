
# NextJS API:

## Client-side
Calls made directly in the browser, usually that can be loaded later, for example blog comments, so that the page does not wait for all the comments to be searched for the post to appear

Example: 
> comments in blog

```typescript
const [comments, setComments] = useState<Comments[]>([]);
useEffect(() => {
  const { data } = await api.get('comments');
  setComments(data.comments);
}, [])
```

## SSP - Server Side Props
Executes on all calls to a home page, that is, every time it accesses this page this code is executed by the client

example:
> Header of blog with name the user logged

```typescript
export const getServerSideProps: GetServerSideProps = async () => {
  const price = await stripe.prices.retrieve('price_id', {
    expand: ['product'] // get all data of product in stripe api
  });
  const product = {
    priceId: price.id,
    amount: formatPrice(price.unit_amount)
  }
  return {
    props: {
      product
    },
  }
}
```

## SSG - Server Side Generation
Generates a static html to be shared between multiple users, e.g. a post page that can be accessed by any user, regenetate with variable revalidate value

example:
> Content of blog equala to all users

> important:  Don`t use with pages with dynamic content

```typescript
export const getStaticProps: GetStaticProps = async () => {
  const price = await stripe.prices.retrieve('price_id', {
    expand: ['product'] // get all data of product in stripe api
  });
  const product = {
    priceId: price.id,
    amount: formatPrice(price.unit_amount)
  }
  return {
    props: {
      product
    },
    revalidate: 60 * 60 * 24 //24 hours
  }
}
```