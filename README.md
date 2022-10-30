
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
# Project Ignite Ignews

Project development using NextJS to the application, stripe to payment of the subscriptions in ignews and faunaDB to persistence data.

Login with github in application.

[https://ignews.felipe-rocha.com](https://www.notion.so/Desafio-02-Componentizando-a-aplica-o-b9f0f025c95b437699d0c3115f55b0f1)


## Technologies used
<div style="display:inline-block">
<img align="center" alt="Typescript" height="30" width="40" src="https://raw.githubusercontent.com/devicons/devicon/master/icons/typescript/typescript-original.svg">
<img align="center" alt="React" height="30" width="40" src="https://raw.githubusercontent.com/devicons/devicon/master/icons/react/react-original.svg">
<img align="center" alt="SASS" height="30" width="40" src="https://raw.githubusercontent.com/devicons/devicon/master/icons/sass/sass-original.svg">
<img align="center" alt="NextJS" height="30" width="40" src="https://raw.githubusercontent.com/devicons/devicon/master/icons/nextjs/nextjs-original.svg">
<img align="center" alt="Docker" height="30" width="40" src="https://raw.githubusercontent.com/devicons/devicon/master/icons/docker/docker-original.svg">
<img align="center" alt="Eslint" height="30" width="40" src="https://raw.githubusercontent.com/devicons/devicon/master/icons/eslint/eslint-original.svg">
<img align="center" alt="Github" height="30" width="40" src="https://raw.githubusercontent.com/devicons/devicon/master/icons/github/github-original.svg">
<img align="center" alt="Yarn" height="30" width="40" src="https://raw.githubusercontent.com/devicons/devicon/master/icons/yarn/yarn-original.svg">
<img align="center" alt="Vscode" height="30" width="40" src="https://raw.githubusercontent.com/devicons/devicon/master/icons/vscode/vscode-original.svg">
</div>

---

## Important:

To run in development environment:
```zsh
yarn dev
```

To run in production environment:
```zsh
yarn build
```

---

![Private investocat](https://octodex.github.com/images/privateinvestocat.jpg)