use anchor_lang::prelude::*;

declare_id!("2eyJNpUiqaLghKUctM91UQET66Yx8BVbds2LvVvjd1Cg");

#[program]
pub mod solana_twitter {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}
