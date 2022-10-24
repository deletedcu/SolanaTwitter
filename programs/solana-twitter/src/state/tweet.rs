use anchor_lang::prelude::*;

#[account]
pub struct Tweet {
    pub user: Pubkey,
    pub timestamp: i64,
    pub state: Option<TweetState>,
    pub tag: String,
    pub content: String,
}

#[derive(Accounts)]
pub struct SendTweet<'info> {
    // space: 8 discriminator + 32 user pubkey + 8 timestamp + 1 state + (4 prefix + 50 * 4) tag + (4 prefix + 280 * 4) content
    #[account(init, payer = user, space = 8 + 32 + 8 + 1 + (4 + 50 * 4) + (4 + 280 * 4))]
    pub tweet: Account<'info, Tweet>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct UpdateTweet<'info> {
    #[account(mut, has_one = user)]
    pub tweet: Account<'info, Tweet>,
    pub user: Signer<'info>,
}

#[derive(Accounts)]
pub struct DeleteTweet<'info> {
    #[account(mut, has_one = user)]
    pub tweet: Account<'info, Tweet>,
    pub user: Signer<'info>,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq, Eq)]
pub enum TweetState {
	Edited,
	Deleted,
}
