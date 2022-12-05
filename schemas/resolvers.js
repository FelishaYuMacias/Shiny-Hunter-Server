const { Hunt, User, Pokemon } = require('../models');
const { AuthenticationError } = require('apollo-server-express');
const { signToken } = require('../utils/auth');


const resolvers = {
    Query: {
        users: async () => {
            return User.find().populate('hunts');
        },
        user: async (parent, { username }) => {
            return User.findOne({ username }).populate('hunts');
        },
        hunts: async () => {
            return Hunt.find().populate('pokemon');
        },
        hunt: async () => {
            return Hunt.findOne({ _id }).populate('pokemon');
        },
        allpokemon: async () => {
            return Pokemon.find();
          },
        pokemon: async ({pokemonId}) => {
            return Pokemon.findOne({ _id: pokemonId });
        },
        me: async (parent, args, context) => {
            if (context.user) {
              return User.findOne({ _id: context.user._id }).populate('hunts');
            }
            throw new AuthenticationError('You need to be logged in!');
          },
    },
Mutation: {
    addUser: async (parent, { username, password }) => {
      const user = await User.create({ username, password });
      const token = signToken(user);
      return { token, user };
    },
    login: async (parent, { email, password }) => {
      const user = await User.findOne({ email });

      if (!user) {
        throw new AuthenticationError('No user found with this email address');
      }

      const correctPw = await user.isCorrectPassword(password);

      if (!correctPw) {
        throw new AuthenticationError('Incorrect credentials');
      }

      const token = signToken(user);

      return { token, user };
    },
    addHunt: async (parent,{ method, counter, dateStarted, dateCompleted, phase, game, pokemon}, context) => {
      if (context.user) {
        const hunt = await Hunt.create({
            method, 
            counter, 
            dateStarted, 
            dateCompleted, 
            phase, 
            game, 
            pokemon,
            user: context.user.username,
        });

        await User.findOneAndUpdate(
          { _id: context.user._id },
          { $addToSet: { hunts: hunt._id } }
        );

        return hunt;
      }
      throw new AuthenticationError('You need to be logged in!');
    },
    addPokemon: async (parent, { huntId, species, level, form, gender }, context) => {
      if (context.user) {
        return Hunt.findOneAndUpdate(
          { _id: huntId },
          {
            $addToSet: {
              pokemon: { species, level, form, gender},
            },
          },
          {
            new: true,
            runValidators: true,
          }
        );
      }
      throw new AuthenticationError('You need to be logged in!');
    },
    removeHunt: async (parent, { huntId }, context) => {
      if (context.user) {
        const hunt = await Hunt.findOneAndDelete({
          _id: huntId,
        });

        await User.findOneAndUpdate(
          { _id: context.user._id },
          { $pull: { hunts: hunt._id } }
        );

        return hunt;
      }
      throw new AuthenticationError('You need to be logged in!');
    },
    removePokemon: async (parent, { pokemonId }, context) => {
        if (context.user) {
          const pokemon = await Pokemon.findOneAndDelete({
            _id: pokemonId,
          });
  
          await User.findOneAndUpdate(
            { _id: context.user._id },
            { $pull: { allpokemon: pokemon._id } }
          );
  
          return pokemon;
        }
        throw new AuthenticationError('You need to be logged in!');
      },
  },
};


module.exports = resolvers;

