use crate::errors::ErrorCode::*;
use crate::state::reaction::*;
use anchor_lang::prelude::*;

pub fn react(ctx: Context<Reaction>, tweet: Pubkey, input_char: String, bump: u8) -> Result<()> {
  let mut reaction = &mut ctx.accounts.reaction;
  let reaction_char = ReactionChar::validate(input_char.chars().nth(0).unwrap());
  let user: &Signer = &ctx.accounts.user;

  require!(reaction_char != ReactionChar::Invalid, ErrorCode::UnallowedChars);

  reaction.user = *user.key;
  reaction.tweet = tweet;
  reaction.reaction_char = reaction_char;
  reaction.bump = bump;

  Ok(())
}

pub fn update_reaction(ctx: Context<UpdateReaction>, input_char: String) -> Result<()> {
  let mut reaction = &mut ctx.accounts.reaction;
  let reaction_char = ReactionChar::validate(input_char.chars().nth(0).unwrap());
  
  require!(reaction.reaction_char != reaction_char, ErrorCode::NothingChanged);
  reaction.reaction_char = reaction_char;

  Ok(())
}

pub fn delete_reaction(ctx: Context<DeleteReaction>) -> Result<()> {
  Ok(())
}

impl ReactionChar {
	fn validate(reaction_char: char) -> Self {
		match reaction_char {
			'👍' => Self::ThumbsUp,
			'🎉' => Self::Party,
			'😆' => Self::Haha,
			'😲' => Self::Wow,
			'🚀' => Self::Rocket,
			'👀' => Self::Eyes,
			_ => Self::Invalid,
		}
	}
}
