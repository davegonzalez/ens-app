This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, install dependencies with:

```bash
yarn
```

Then, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Notes

Overall, a fun project! I love the aesthetic, so kudos! First and foremost, while I felt pretty good about my results, I wasn't able to get the newest/oldest and oldest/newest sorting working for queried results; I only have this working for the initial set of registrations.

What I found is that the ENS subgraph makes this a little challenging (as far as I can tell). I thought I'd be able to do the following query:

```js
registrations(
  first: 10,
  orderBy: registrationDate,
  orderDirection: asc,
  where: { domain_contains: "dave" }) {
    labelName
  }
```

But this always returns an empty array - no matter what I'm searching for in the `domain_contains` field. The types suggest it should be a string but I couldn't find any other documentation around what it's actually expecting. After this I started looking at the `domains` query and came up with this:

```js
domains(first: 10, orderDirection: asc, where: { name_contains: "dave" }) {
  labelName
}
```

This works - the problem with it is that there's no direct information about the `registrationDate` attached to the domain. I found that you could use the `labelHash` to query the registration by id; I also noticed that in the `events` object it had a list of all events and it would be a matter of figuring out which event was the inital registration (less than ideal).

Having two separate queries - the initial `domains` query and then a secondary `registration(id: labelHash)` query is what's ultimately stumping me. I know there's some async/promise.all magic to wait for each registration query to complete
