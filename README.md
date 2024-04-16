# String Processor Tutorial

Welcome to an interactive tutorial on Coinweb's
[reactive smart contracts](https://docs.coinweb.io/develop/reactive-smart-contracts/)!

## Introduction

In this comprehensive guide, we'll embark on a journey through the creation,
deployment, and interaction with a smart contract designed to reverse strings
and record claims in the Coinweb database. Our tutorial is structured to
gradually increase in complexity, ensuring a smooth learning curve.

- We'll start by crafting a simple string processor contract. You'll learn how
  to use the command-line interface (CLI) of the `@coinweb/cweb-tool` to invoke
  a pre-defined contract template in YAML format, which will handle the string
  processing and basic CRUD operations with regards to claims storage. Once
  deployed, we'll guide you through the process of retrieving and verifying
  these claims directly from the user interface (UI) by searching for the stored
  claim.

- Next, we'll elevate the complexity by showing you how to call the contract
  from the UI itself, providing method arguments for string processing. After
  the contract execution, you'll revisit the claims to observe the changes in
  Coinweb's claims DB.

- Afterwards, we'll integrate the Coinweb wallet app into our workflow. You'll
  prepare the contract call operation in the frontend, and then use Coinweb's
  wallet app to execute the contract call securely.

By the end of this tutorial, you'll have a solid understanding of reactive smart
contracts and the confidence to build and interact with them in various ways.
Let us get started on this adventure into the world of reactive smart contracts!

## Scope

This tutorial is designed to cover the basics of Coinweb's reactive smart
contracts.

- `StoreOp` - Store a claim into the database owned by the transaction issuer
- `CallOp` - Invocation of a smart contract
- Reading claims from GraphQL/Devnet API
- Onchain code and method handlers

Please checkout other tutorials if you want to learn about `DataOp`, `ReadOp`,
`TakeOp`, `BlockOp`. These operations add too much complexity to the scope of
this tutorial and are granularly covered in other tutorials.
