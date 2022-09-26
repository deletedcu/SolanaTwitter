use crate::errors::ErrorCode::*;
use crate::state::user_alias::*;
use anchor_lang::prelude::*;

pub fn create_user_alias(ctx: Context<CreateUserAlias>, alias: String) -> Result<()> {
  let user_alias = &mut ctx.accounts.user_alias;

  require!(alias.chars().count() <= 50, ErrorCode::TooLong);

  user_alias.alias = alias;
  user_alias.bump = *ctx.bumps.get("user_alias").unwrap();

  Ok(())
}

pub fn update_user_alias(ctx: Context<UpdateUserAlias>, new_alias: String) -> Result<()> {
  let user_alias = &mut ctx.accounts.user_alias;

  require!(user_alias.alias != new_alias, ErrorCode::NothingChanged);
  require!(new_alias.chars().count() <= 50, ErrorCode::TooLong);

  user_alias.alias = new_alias;

  Ok(())
}

pub fn delete_user_alias(ctx: Context<DeleteUserAlias>) -> Result<()> {
  Ok(())
}
