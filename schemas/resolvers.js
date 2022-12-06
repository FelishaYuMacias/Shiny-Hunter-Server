const { Hunt, User, Pokemon } = require('../models');
const { AuthenticationError } = require('apollo-server-express');
const { signToken } = require('../utils/auth');


const resolvers = {
    Query: {
        users: async () => {
            return await User.find({}).populate('hunts').populate({
              path: 'hunt',
              populate: 'pokemon'
            });
        },
        user: async (parent, { username }) => {
            return await User.findOne({ username }).populate('hunts').populate({
              path: 'hunt',
              populate: 'pokemon'
            });
        },
        hunts: async () => {
            return await Hunt.find({}).populate('pokemon');
        },
        hunt: async () => {
            return await Hunt.findOne({ _id }).populate('pokemon');
        },
        allpokemon: async () => {
            return await Pokemon.find({});
          },
        pokemon: async ({pokemonId}) => {
            return await Pokemon.findOne({ _id: pokemonId });
        },
        me: async (parent, args, context) => {
            if (context.user) {
              return await User.findOne({ _id: context.user._id }).populate('hunts').populate({
                path: 'hunt',
                populate: 'pokemon'
              });
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
    login: async (parent, { username, password }) => {
      const user = await User.findOne({ username });

      if (!user) {
        throw new AuthenticationError('No user found with this username');
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
    updateHunt: async (parent,{id, method, counter, dateStarted, dateCompleted, phase, game, pokemon}, context) => {
      if (context.user) {
        const hunt = await Hunt.findOneAndUpdate({_id:id},{
            method, 
            counter, 
            dateStarted, 
            dateCompleted, 
            phase, 
            game, 
            pokemon,
            user: context.user.username,
        }, { new: true });
        return hunt;
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
    addPokemon: async (parent, { huntId, species, level, form, gender }, context) => {
      if (context.user) {
        return await Hunt.findOneAndUpdate(
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
    updatePokemon: async (parent, { id, huntId, species, level, form, gender }) => {
      if (context.user) {
      // Find and update the matching class using the destructured args
      return await Hunt.findOneAndUpdate(
        { _id: id }, 
        { huntId, species, level, form, gender },
        // Return the newly updated object instead of the original
        { new: true }
      );
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

